import type { ResolvedVXRNConfig } from '../config/getOptionsFilled';
export declare function reactNativeHMRPlugin({ root }: ResolvedVXRNConfig): {
    name: string;
    handleHotUpdate(this: void, { read, modules, file }: import("vite").HmrContext): Promise<void>;
};
//# sourceMappingURL=reactNativeHMRPlugin.d.ts.map