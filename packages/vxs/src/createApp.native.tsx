// TODO HACK why is window being defined????
// @ts-ignore
delete globalThis.window

import { Root } from './Root'
import { AppRegistry } from 'react-native'

export type CreateAppProps = { routes: Record<string, () => Promise<unknown>> }

export function createApp(options: CreateAppProps): void {
  console.info(
    `createApp() with routes: ${options.routes}\n${Object.keys(options.routes || []).join('\n')}`
  )
  const App = () => <Root isClient routes={options.routes} path="/" />
  AppRegistry.registerComponent('main', () => App)
  AppRegistry.registerComponent('tamaguikitchensink', () => App)
}
