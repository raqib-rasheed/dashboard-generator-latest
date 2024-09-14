import { areAllFieldsValidNumber, checkIfXYFieldsAreValid } from '~/utils'

import { VisualisationData } from '../api'
import { ConfForFrontendUse, VisualisationType } from '../types'

import { doesWidgetContainAxisValueDetails } from '.'

type Props = {
  visualisationData?: VisualisationData
  visualisationType?: VisualisationType
  conf?: ConfForFrontendUse
  xAxis?: string
  yAxis?: string | string[]
}

export function getAxisValidations({
  visualisationData,
  visualisationType,
  conf,
  xAxis,
  yAxis,
}: Props) {
  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: visualisationData,
    xField: xAxis,
    yField: yAxis,
  })

  // TypeScript fails below, saying that "table" is not assignable to the other broader type, ts-reset is helping here. See https://github.com/total-typescript/ts-reset#make-includes-on-as-const-arrays-less-strict
  const containsAxisDetails = doesWidgetContainAxisValueDetails(
    visualisationType ?? 'table'
  )

  const areAllYfieldsAValidNumber =
    containsAxisDetails && yAxis
      ? areAllFieldsValidNumber({
          yField: yAxis,
          conf: conf ?? {},
        })
      : true

  return {
    isXFieldValid,
    isYFieldValid,
    containsAxisDetails,
    areAllYfieldsAValidNumber,
  }
}
