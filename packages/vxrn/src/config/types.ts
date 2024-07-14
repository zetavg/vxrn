import type { Hono } from 'hono'
import type { Options as FlowOptions } from '@vxrn/vite-flow'

import type { AfterBuildProps } from '../types'

export type VXRNOptions = {
  /**
   * The entry points to your app. For web, it defaults to using your `root` to look for an index.html
   *
   * Defaults:
   *   native: ./src/entry-native.tsx
   */
  entries?: {
    native?: string
    web?: string
  }
  root?: string
  host?: string
  port?: number

  /**
   * Uses mkcert to create a self-signed certificate
   */
  https?: boolean

  flow?: FlowOptions

  // for hooking into things
  afterBuild?: (props: AfterBuildProps) => void | Promise<void>
  afterServerStart?: (options: VXRNOptions, app: Hono) => void | Promise<void>
}
