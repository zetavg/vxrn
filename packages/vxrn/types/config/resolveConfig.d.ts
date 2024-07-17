import { type Plugin } from 'vite';
import type { InlineConfig, ResolvedConfig, ResolvedViteConfig } from './types';
/**
 * The main function used to resolve VXRN config.
 */
export declare function resolveConfig(inlineConfig: InlineConfig, command: 'build' | 'serve', defaultMode?: string, defaultNodeEnv?: string, isPreview?: boolean, patchConfig?: ((config: ResolvedViteConfig) => void) | undefined, patchPlugins?: ((resolvedPlugins: Plugin[]) => void) | undefined): Promise<ResolvedConfig>;
//# sourceMappingURL=resolveConfig.d.ts.map