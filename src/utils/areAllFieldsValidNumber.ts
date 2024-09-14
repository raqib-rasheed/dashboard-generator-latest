import { tDataConfig } from '../components/visualisers/types/customTypes'

function isFieldAValidNumber({
  field,
  conf,
}: {
  field: string
  conf: Record<string, tDataConfig>
}) {
  return conf?.[field]
    ? conf[field]?.data_type === 'number' || conf[field]?.data_type === 'rating'
    : true
}

export function areAllFieldsValidNumber({
  yField,
  conf,
}: {
  yField: string | string[]
  conf: Record<string, tDataConfig>
}) {
  if (typeof yField === 'string') {
    return isFieldAValidNumber({ conf, field: yField })
  }
  const boolArr = yField.map((field) => isFieldAValidNumber({ conf, field }))
  if (boolArr.every(Boolean)) return true
  return false
}
