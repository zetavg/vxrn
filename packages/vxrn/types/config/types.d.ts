import type { ConfigEnv, UserConfig as ViteUserConfig, ResolvedConfig as ResolvedViteConfig } from 'vite';
import type { Hono } from 'hono';
import type { Options as FlowOptions } from '@vxrn/vite-flow';
import type { AfterBuildProps } from '../types';
import type { ResolvedVXRNConfig } from './resolveVXRNConfig';
export type { ViteUserConfig, ResolvedViteConfig };
/** The configurations set by the user - all properties are optional. */
export type UserConfig = ViteUserConfig & VXRNUserConfig;
export type UserConfigFnObject = (env: ConfigEnv) => UserConfig;
export type UserConfigFnPromise = (env: ConfigEnv) => Promise<UserConfig>;
export type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFnObject | UserConfigFnPromise | UserConfigFn;
/**
 * Type helper to make it easier to use `vxrn.config.ts`.
 *
 * Accepts a direct {@link UserConfig} object, or a function that returns it.
 * The function receives a {@link ConfigEnv} object.
 */
export declare function defineConfig(config: UserConfig): UserConfig;
export declare function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>;
export declare function defineConfig(config: UserConfigFnObject): UserConfigFnObject;
export declare function defineConfig(config: UserConfigExport): UserConfigExport;
/** Resolved config, with defaults filled and properties becomes non-nullable, relative paths resolved into absolute paths, cache initialized, etc. */
export type ResolvedConfig = ResolvedViteConfig & ResolvedVXRNConfig;
/** Configurations that users may pass through CLI. */
export type InlineConfig = UserConfig & {
    configFile?: string | false;
};
export type VXRNUserConfig = {
    /**
     * The entry points to your app. For web, it defaults to using your `root` to look for an index.html
     *
     * Defaults:
     *   native: ./src/entry-native.tsx
     */
    entries?: {
        native?: string;
        web?: string;
    };
    root?: string;
    host?: string;
    port?: number;
    /**
     * Uses mkcert to create a self-signed certificate
     */
    https?: boolean;
    flow?: FlowOptions;
    afterBuild?: (props: AfterBuildProps) => void | Promise<void>;
    afterServerStart?: (options: VXRNUserConfig, app: Hono) => void | Promise<void>;
};
//# sourceMappingURL=types.d.ts.map