import { VisualisationData } from '~/refactored/features/widgets/create-widget/api'

export function checkIfXYFieldsAreValid({
  data = [],
  xField,
  yField,
}: {
  data?: VisualisationData
  xField?: string | ''
  yField?: string | string[] | ''
}) {
  const validKeys = data?.length > 0 ? Object.keys(data[0]) : []
  const isXFieldValid = xField ? validKeys.includes(xField) : false
  const isYFieldValid = yField
    ? typeof yField === 'string'
      ? validKeys.includes(yField)
      : yField?.every((field) => validKeys.includes(field))
    : false
  return { isXFieldValid, isYFieldValid }
}
