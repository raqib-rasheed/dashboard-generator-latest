import { isNumber } from 'lodash'

import { VisualisationData } from '../api'

type Props = {
  visualisationData?: VisualisationData
}

export function getStatsDataAndValidation({ visualisationData }: Props) {
  const isDataExisting = visualisationData && visualisationData.length
  const yField = isDataExisting ? Object.keys(visualisationData[0])[0] : null
  const statData = isDataExisting ? visualisationData[0][yField ?? 'count'] : 0
  const multipleFieldsExist = isDataExisting && visualisationData.length > 1
  const isStatsVisualizationPossible =
    !multipleFieldsExist && isNumber(statData)

  return {
    yField,
    statData,
    multipleFieldsExist,
    isStatsVisualizationPossible,
  }
}
