import { underscore } from 'inflection'
import { SnakeCasedPropertiesDeep } from 'type-fest'

export function convertObjectKeysToSnakeCase<
  T extends Record<string, unknown | Array<Record<string, unknown>>>,
>(formValues: T): SnakeCasedPropertiesDeep<T> {
  const snakeCasedVersion = Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => {
      if (Array.isArray(value)) {
        const arr = value.map((val) => {
          return typeof val === 'object'
            ? convertObjectKeysToSnakeCase(val as any)
            : val
        })
        return [underscore(key), arr]
      }
      if (value != null && typeof value === 'object') {
        const updatedValue = convertObjectKeysToSnakeCase(
          value as Record<string, unknown>
        )
        return [underscore(key), updatedValue]
      }
      return [underscore(key), value]
    })
  )
  return snakeCasedVersion as SnakeCasedPropertiesDeep<T>
}
