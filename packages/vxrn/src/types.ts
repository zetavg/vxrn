import type { UserConfig } from 'vite'
import type { OutputAsset, OutputChunk } from 'rollup'
import type { VXRNOptions } from './config/types'

export type { VXRNOptions }

type RollupOutputList = [OutputChunk, ...(OutputChunk | OutputAsset)[]]

export type BuildArgs = { step?: string; only?: string; analyze?: boolean }

export type AfterBuildProps = {
  options: VXRNOptions
  clientOutput: RollupOutputList
  serverOutput: RollupOutputList
  webBuildConfig: UserConfig
  buildArgs?: BuildArgs
  clientManifest: {
    // app/[user].tsx
    [key: string]: ClientManifestEntry
  }
}

export type ClientManifestEntry = {
  file: string // assets/_user_-Bg0DW2rm.js
  src?: string // app/[user].tsx
  isDynamicEntry?: boolean // true for import.meta.globbed
  isEntry?: boolean // true for index.html
  name: string // _user_
  imports: string[]
  css?: string[]
}

export type HMRListener = (update: { file: string; contents: string }) => void
