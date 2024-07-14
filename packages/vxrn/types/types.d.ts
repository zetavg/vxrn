import type { UserConfig } from 'vite';
import type { OutputAsset, OutputChunk } from 'rollup';
import type { VXRNUserConfig } from './config/types';
export type { VXRNUserConfig };
type RollupOutputList = [OutputChunk, ...(OutputChunk | OutputAsset)[]];
export type BuildArgs = {
    step?: string;
    only?: string;
    analyze?: boolean;
};
export type AfterBuildProps = {
    options: VXRNUserConfig;
    clientOutput: RollupOutputList;
    serverOutput: RollupOutputList;
    webBuildConfig: UserConfig;
    buildArgs?: BuildArgs;
    clientManifest: {
        [key: string]: ClientManifestEntry;
    };
};
export type ClientManifestEntry = {
    file: string;
    src?: string;
    isDynamicEntry?: boolean;
    isEntry?: boolean;
    name: string;
    imports: string[];
    css?: string[];
};
export type HMRListener = (update: {
    file: string;
    contents: string;
}) => void;
//# sourceMappingURL=types.d.ts.map