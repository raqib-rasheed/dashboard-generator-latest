import { notification } from 'antd'

export function removeDuplicateFromArray<T>(arr: T[], field: keyof T): T[] {
  const seen = new Set()
  const arrWithUniqueElements = arr.filter((item) => {
    const variable = item[field] as string
    const duplicate = seen.has(variable)
    if (duplicate) {
      notification.destroy()
      notification.error({
        message: (
          <>
            Filter with variable name{' '}
            <span style={{ color: '#1890ff' }}>{variable}</span> already exists.
            Please choose a different name
          </>
        ),
      })
    }
    seen.add(variable)
    return !duplicate
  })
  return arrWithUniqueElements
}
