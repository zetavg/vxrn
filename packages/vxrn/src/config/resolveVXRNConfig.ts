import { join } from 'node:path'
import { readPackageJSON } from 'pkg-types'
import { createRequire } from 'node:module'
import FSExtra from 'fs-extra'
import type { VXRNUserConfig } from './types'
import { getPort } from 'get-port-please'

const require = createRequire(import.meta.url)

export type ResolvedVXRNConfig = Awaited<ReturnType<typeof resolveVXRNConfig>>

/**
 * Fills the user config with defaults and resolves paths, etc.
 *
 * Note: unlike Vite's `resolveConfig`, this function isn't in charged of loading the config from the user config file.
 */
export async function resolveVXRNConfig(
  userConfig: VXRNUserConfig,
  internal: { mode?: 'dev' | 'prod' } = { mode: 'dev' }
) {
  const { host = '127.0.0.1', root = process.cwd(), entries, https } = userConfig

  const defaultPort = userConfig.port || (internal.mode === 'dev' ? 8081 : 3000)

  const port = await getPort({
    port: defaultPort,
    portRange: [defaultPort, defaultPort + 100],
    host: '127.0.0.1',
  })

  const packageRootDir = join(require.resolve('vxrn'), '../../..')
  const cacheDir = join(root, 'node_modules', '.vxrn')
  const internalPatchesDir = join(packageRootDir, 'patches')
  const userPatchesDir = join(root, 'patches')
  const [state, packageJSON] = await Promise.all([
    //
    readState(cacheDir),
    readPackageJSON(),
  ])
  return {
    ...userConfig,
    protocol: https ? ('https:' as const) : ('http:' as const),
    entries: {
      native: './src/entry-native.tsx',
      server: './src/entry-server.tsx',
      ...entries,
    },
    packageJSON,
    state,
    packageRootDir,
    cacheDir,
    userPatchesDir,
    internalPatchesDir,
    host,
    root,
    port,
  }
}

/**
 * Actually same as `resolveVXRNConfig`, but with refined type to handle additional properties nicely.
 */
export async function resolveVXRNConfigWithAdditionalProperties<T>(
  userConfigWithAdditionalProperties: VXRNUserConfig & T
): Promise<ResolvedVXRNConfig & T> {
  // This object spread is only used to make TS happy and unnecessary for the runtime as the `resolveVXRNConfig` already spreads the input object into the return object.
  return {
    ...userConfigWithAdditionalProperties,
    ...(await resolveVXRNConfig(userConfigWithAdditionalProperties)),
  }
}

type State = {
  applyPatches?: boolean
}

async function readState(cacheDir: string) {
  const statePath = join(cacheDir, 'state.json')
  const state: State = (await FSExtra.pathExists(statePath))
    ? await FSExtra.readJSON(statePath)
    : {}
  return state
}
