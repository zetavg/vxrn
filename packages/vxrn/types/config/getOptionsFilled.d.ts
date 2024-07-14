import type { VXRNOptions } from './types';
export type VXRNOptionsFilled = Awaited<ReturnType<typeof getOptionsFilled>>;
export declare function getOptionsFilled(options: VXRNOptions, internal?: {
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
    afterServerStart?: ((options: VXRNOptions, app: import("hono").Hono<import("hono").Env, import("hono/types").BlankSchema, "/">) => void | Promise<void>) | undefined;
}>;
type State = {
    applyPatches?: boolean;
};
export {};
//# sourceMappingURL=getOptionsFilled.d.ts.map