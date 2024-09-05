import type { Environment, Plugin } from 'vite';
export declare const clientTreeShakePlugin: () => Plugin;
export declare function transformTreeShakeClient(code: string, id: string, settings: {
    ssr?: boolean;
} | undefined, { environment }: {
    environment: Environment;
}): Promise<{
    code: string;
    map: {
        version: number;
        sources: string[];
        names: string[];
        sourceRoot?: string | undefined;
        sourcesContent?: string[] | undefined;
        mappings: string;
        file: string;
    } | null;
} | undefined>;
//# sourceMappingURL=clientTreeShakePlugin.d.ts.map