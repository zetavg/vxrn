import type { Plugin } from 'vite';
type ExpoManifestRequestHandlerPluginConfig = {
    /** The root of the Expo project. */
    projectRoot: string;
};
/**
 * Let the Vite dev server support handling [Expo Manifest Request](https://github.com/expo/expo/blob/sdk-50/docs/pages/archive/technical-specs/expo-updates-0.mdx#manifest-request), which is required for Expo Go to work.
 */
export declare function expoManifestRequestHandlerPlugin({ projectRoot, }: ExpoManifestRequestHandlerPluginConfig): Plugin;
export {};
//# sourceMappingURL=expoManifestRequestHandlerPlugin.d.ts.map