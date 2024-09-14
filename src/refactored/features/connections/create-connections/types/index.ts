import { SnakeCasedPropertiesDeep } from 'type-fest'
import { z } from 'zod'

const ConnectionName = z.object({
  name: z.string().min(1, 'Required'),
})

const ConnectionConf = z.object({
  hostUrl: z.string().min(1, 'Required'),
  portNumber: z.string().min(1, 'Required'),
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  databaseName: z.string().min(1, 'Required'),
})

export const Connection = z.object({
  ...ConnectionName.shape,
  ...ConnectionConf.shape,
})

export type Connection = z.infer<typeof Connection>

type ConnectionConf = z.infer<typeof ConnectionConf>
export type ShapeRequiredByBackend = {
  conf: ConnectionConf
  name: Connection['name']
}

export type BackendConnectionPayload =
  SnakeCasedPropertiesDeep<ShapeRequiredByBackend>

export type ConnectionResponseData = {
  id: number
  is_connected: boolean
  db_type: string
  name: Connection['name']
  conf: ConnectionConf
}
