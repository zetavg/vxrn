import { resolveConfig as viteResolveConfig, type Plugin } from 'vite'
import type { InlineConfig, ResolvedConfig, ResolvedViteConfig } from './types'
import { findConfigFile } from './findConfigFile'
import { resolveVXRNConfigWithAdditionalProperties } from './resolveVXRNConfig'

/**
 * The main function used to resolve VXRN config.
 */
export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
  patchConfig: ((config: ResolvedViteConfig) => void) | undefined = undefined,
  patchPlugins: ((resolvedPlugins: Plugin[]) => void) | undefined = undefined
): Promise<ResolvedConfig> {
  const { root = process.cwd() } = inlineConfig
  let { configFile } = inlineConfig

  // Find the config file if it's not explicitly set and using a config file is not disabled.
  // While `viteResolveConfig` also does something similar, we need to do it here to support vxrn specific config files.
  if (!configFile && configFile !== false) {
    configFile = findConfigFile({ root }) || undefined
  }

  const viteResolvedConfig = await viteResolveConfig(
    {
      ...inlineConfig,
      configFile,
    },
    command,
    defaultMode,
    defaultNodeEnv,
    isPreview,
    patchConfig,
    patchPlugins
  )

  viteResolvedConfig.mode

  const resolvedConfig: ResolvedConfig = await resolveVXRNConfigWithAdditionalProperties(viteResolvedConfig)

  // TODO: apply VXRN default configurations and merge with resolvedConfig.

  return resolvedConfig
}
