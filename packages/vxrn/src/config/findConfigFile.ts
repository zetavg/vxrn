import path from 'node:path'
import fs from 'node:fs'

import { DEFAULT_CONFIG_FILES } from '../constants'

/**
 * Find the config file from the project root directory. Returns null if not found.
 */
export function findConfigFile({
  root,
}: {
  /** Project root directory to find the config file from */
  root: string
}): string | null {
  for (const filename of DEFAULT_CONFIG_FILES) {
    const filePath = path.resolve(root, filename)
    if (!fs.existsSync(filePath)) continue

    return filePath
  }

  return null
}
