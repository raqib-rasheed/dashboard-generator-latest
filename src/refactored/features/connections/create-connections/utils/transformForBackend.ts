import { convertObjectKeysToSnakeCase } from '~/refactored/utils/convertObjectKeysToSnakeCase'

import { BackendConnectionPayload, Connection } from '../types'

export function transformForBackend(
  connectionValue: Connection
): BackendConnectionPayload {
  const { name, ...rest } = connectionValue
  const backendConnection = convertObjectKeysToSnakeCase({ name, conf: rest })
  return backendConnection
}
