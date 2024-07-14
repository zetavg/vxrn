import type { VXRNUserConfig } from './types';
export type ResolvedVXRNConfig = Awaited<ReturnType<typeof resolveVXRNConfig>>;
/**
 * Fills the user config with defaults and resolves paths, etc.
 *
 * Note: unlike Vite's `resolveConfig`, this function isn't in charged of loading the config from the user config file.
 */
export declare function resolveVXRNConfig(userConfig: VXRNUserConfig, internal?: {
    mode?: 'dev' | 'prod';
}): Promise<{
    protocol: "https:" | "http:";
    entries: {
        native: string;
        web?: string | undefined;
        server: string;
    };
    packageJSON: import("pkg-types").PackageJson;
    state: State;
    packageRootDir: string;
    cacheDir: string;
    userPatchesDir: string;
    internalPatchesDir: string;
    host: string;
    root: string;
    port: number;
    https?: boolean | undefined;
    flow?: import("@vxrn/vite-flow").Options | undefined;
    afterBuild?: ((props: import("..").AfterBuildProps) => void | Promise<void>) | undefined;
    afterServerStart?: ((options: VXRNUserConfig, app: import("hono").Hono<import("hono").Env, import("hono/types").BlankSchema, "/">) => void | Promise<void>) | undefined;
}>;
type State = {
    applyPatches?: boolean;
};
export {};
//# sourceMappingURL=resolveVXRNConfig.d.ts.map