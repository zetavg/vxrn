import './polyfills'

// plugins
export { clientTreeShakePlugin } from './vite/clientTreeShakePlugin'
export { createFileSystemRouter } from './vite/createFileSystemRouter'
export { vitePluginSsrCss } from './vite/vitePluginSsrCss'
export { removeReactNativeWebAnimatedPlugin } from './vite/removeReactNativeWebAnimatedPlugin'

export { setCurrentRequestHeaders } from './vite/headers'

export { build } from './vite/build'
export { serve } from './vite/serve'
export { vxs } from './vite/vxs'
