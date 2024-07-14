import { serve as honoServe } from '@hono/node-server'

import type { VXRNUserConfig } from '../types'
import { createProdServer } from './createServer'
import { resolveVXRNConfig } from '../config/getOptionsFilled'

export const serve = async (optionsIn: VXRNUserConfig) => {
  const options = await resolveVXRNConfig(optionsIn, { mode: 'prod' })
  const app = await createProdServer(options)

  // strange prevents a cant listen on port issue
  await new Promise((res) => setTimeout(res, 1))

  const server = honoServe({
    fetch: app.fetch,
    port: options.port,
    hostname: options.host,
  })

  console.info(`Listening on http://${options.host}:${options.port}`)

  if (options.afterServerStart) {
    await options.afterServerStart(options, app)
  }

  await new Promise<void>((res) => {
    server.on('close', () => {
      res()
    })
  })
}
