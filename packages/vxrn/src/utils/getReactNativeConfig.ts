import * as babel from '@babel/core'
import createViteFlow from '@vxrn/vite-flow'
import viteNativeSWC from '@vxrn/vite-native-swc'
import {
  type Plugin,
  resolveConfig,
  transformWithEsbuild,
  type InlineConfig,
  type UserConfig,
} from 'vite'
import { nativeExtensions } from '../constants'
import { reactNativeCommonJsPlugin } from '../plugins/reactNativeCommonJsPlugin'
import { dedupe } from './getBaseViteConfig'
import { getOptimizeDeps } from './getOptimizeDeps'
import type { VXRNOptionsFilled } from './getOptionsFilled'
import { swapPrebuiltReactModules } from './swapPrebuiltReactModules'
import nodeResolve from '@rollup/plugin-node-resolve'
import { dirname, join } from 'node:path'
import { stat } from 'node:fs/promises'

/**
 * Taken from https://github.com/software-mansion/react-native-reanimated/blob/3.15.1/packages/react-native-reanimated/plugin/src/autoworkletization.ts#L19-L59, need to check if this is up-to-date when supporting newer versions of react-native-reanimated.
 */
const REANIMATED_AUTOWORKLETIZATION_KEYWORDS = [
  'useAnimatedGestureHandler',
  'useAnimatedScrollHandler',
  'useFrameCallback',
  'useAnimatedStyle',
  'useAnimatedProps',
  'createAnimatedPropAdapter',
  'useDerivedValue',
  'useAnimatedReaction',
  'useWorkletCallback',
  'withTiming',
  'withSpring',
  'withDecay',
  'withRepeat',
  'runOnUI',
  'executeOnUIRuntimeSync',
]

/**
 * Regex to test if a piece of code should be processed by react-native-reanimated's Babel plugin.
 */
const REANIMATED_REGEX = new RegExp(
  ['worklet', ...REANIMATED_AUTOWORKLETIZATION_KEYWORDS].join('|')
)

const IGNORE_ROLLUP_LOGS_RE =
  /vite-native-client\/dist\/esm\/client\.native\.js|node_modules\/\.vxrn\/react-native\.js/

export async function getReactNativeConfig(options: VXRNOptionsFilled, viteRNClientPlugin: any) {
  const { root, port } = options
  const { optimizeDeps } = getOptimizeDeps('build')

  async function babelReanimated(input: string, filename: string) {
    return await new Promise<string>((res, rej) => {
      babel.transform(
        input,
        {
          plugins: ['react-native-reanimated/plugin'],
          filename,
        },
        (err: any, result) => {
          if (!result || err) rej(err || 'no res')
          res(result!.code!)
        }
      )
    })
  }

  const viteFlow = options.flow ? createViteFlow(options.flow) : null

  // build app
  let nativeBuildConfig = {
    plugins: [
      // vite doesnt support importing from a directory but its so common in react native
      // so lets make it work, and node resolve theoretically fixes but you have to pass in moduleDirs
      // but we need this to work anywhere including in normal source files
      {
        name: 'node-dir-imports',
        enforce: 'pre',

        async resolveId(importee, importer) {
          if (!importer || !importee.startsWith('./')) {
            return null
          }
          // let nodeResolve handle node_modules
          if (importer?.includes('node_modules')) {
            return
          }
          try {
            const resolved = join(dirname(importer), importee)
            if ((await stat(resolved)).isDirectory()) {
              // fix for importing a directory
              // TODO this would probably want to support their configured extensions
              // TODO also platform-specific extensions
              for (const ext of ['ts', 'tsx', 'js']) {
                try {
                  const withExt = join(resolved, `index.${ext}`)
                  await stat(withExt)
                  // its a match
                  return withExt
                } catch {
                  // keep going
                }
              }
            }
          } catch {
            // not a dir keep going
          }
        },
      } satisfies Plugin,

      nodeResolve(),

      viteFlow,

      swapPrebuiltReactModules(options.cacheDir),

      {
        name: 'reanimated',
        async transform(code, id) {
          if (REANIMATED_REGEX.test(code)) {
            const out = await babelReanimated(code, id)
            return out
          }
        },
      },

      viteRNClientPlugin,

      reactNativeCommonJsPlugin({
        root,
        port,
        mode: 'build',
      }),

      // Avoid "failed to read input source map: failed to parse inline source map url" errors on certain packages, such as react-native-reanimated.
      {
        name: 'remove-inline-source-maps',
        transform: {
          order: 'pre',
          async handler(code, id) {
            if (!id.includes('react-native-reanimated')) {
              return null
            }

            const inlineSourceMapIndex = code.lastIndexOf('//# sourceMappingURL=')
            if (inlineSourceMapIndex >= 0) {
              return code.slice(0, inlineSourceMapIndex).trimEnd()
            }

            return null
          },
        },
      },

      viteNativeSWC({
        tsDecorators: true,
        mode: 'build',
      }),

      {
        name: 'treat-js-files-as-jsx',
        transform: {
          order: 'pre',
          async handler(code, id) {
            if (!id.includes('node_modules/expo-') && !id.includes('node_modules/@expo/')) {
              return null
            }
            // Use the exposed transform from vite, instead of directly
            // transforming with esbuild
            return transformWithEsbuild(code, id, {
              loader: 'jsx',
              jsx: 'automatic',
            })
          },
        },
      },
    ].filter(Boolean),

    appType: 'custom',
    root,
    clearScreen: false,

    optimizeDeps: {
      ...optimizeDeps,
      esbuildOptions: {
        jsx: 'automatic',
      },
    },

    resolve: {
      dedupe,
      extensions: nativeExtensions,
    },

    mode: 'development',

    define: {
      'process.env.NODE_ENV': `"development"`,
    },

    build: {
      ssr: false,
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        ignore(id) {
          return id === 'react/jsx-runtime' || id === 'react/jsx-dev-runtime'
        },
      },
      rollupOptions: {
        input: options.entries.native,
        treeshake: false,
        preserveEntrySignatures: 'strict',
        output: {
          preserveModules: true,
          format: 'cjs',
        },

        onwarn(message, warn) {
          // Suppress "Module level directives cause errors when bundled" warnings
          if (!process.env.DEBUG?.startsWith('vxrn')) {
            if (
              message.code === 'MODULE_LEVEL_DIRECTIVE' ||
              message.code === 'INVALID_ANNOTATION' ||
              message.code === 'MISSING_EXPORT' ||
              message.code === 'SOURCEMAP_ERROR'
            ) {
              warnAboutSuppressingLogsOnce()
              return
            }
          }
          warn(message)
        },

        onLog(level, log, handler) {
          if (!process.env.DEBUG?.startsWith('vxrn')) {
            if (IGNORE_ROLLUP_LOGS_RE.test(log.message)) {
              warnAboutSuppressingLogsOnce()
              return
            }
          }

          handler(level, log)
        },
      },
    },
  } satisfies InlineConfig

  // TODO
  // if (options.nativeConfig) {
  //   nativeBuildConfig = mergeConfig(nativeBuildConfig, options.nativeConfig) as any
  // }

  // // this fixes my swap-react-native plugin not being called pre 😳
  await resolveConfig(nativeBuildConfig, 'build')

  return nativeBuildConfig satisfies UserConfig
}

let didWarnSuppressingLogs = false
function warnAboutSuppressingLogsOnce() {
  if (!didWarnSuppressingLogs) {
    didWarnSuppressingLogs = true
    console.warn(` [vxrn] Suppressing a few mostly harmless logs, enable with DEBUG=vxrn`)
  }
}
