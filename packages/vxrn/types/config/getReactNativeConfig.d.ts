import type { ResolvedVXRNConfig } from './resolveVXRNConfig';
export declare function getReactNativeConfig(options: ResolvedVXRNConfig, viteRNClientPlugin: any): Promise<{
    plugins: any[];
    appType: "custom";
    root: string;
    clearScreen: false;
    optimizeDeps: {
        esbuildOptions: {
            jsx: "automatic";
        };
        include: string[];
        exclude: string[];
        needsInterop: string[];
    };
    resolve: {
        dedupe: string[];
        extensions: string[];
    };
    mode: string;
    define: {
        'process.env.NODE_ENV': string;
    };
    build: {
        ssr: false;
        minify: false;
        commonjsOptions: {
            transformMixedEsModules: true;
            ignore(id: string): boolean;
        };
        rollupOptions: {
            input: string;
            treeshake: false;
            preserveEntrySignatures: "strict";
            output: {
                preserveModules: true;
                format: "cjs";
            };
        };
    };
}>;
//# sourceMappingURL=getReactNativeConfig.d.ts.map