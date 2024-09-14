import * as React from 'react'

import {
  ConfForAnyField,
  ConfForFrontendUse,
  VisualisationType,
} from '../../../../types'

export type ConfObjectWithId = Record<string, ConfForAnyField & { id: string }>
export function useConfOrderState({
  conf,
  visualisationType,
  xAxis,
  yAxis,
}: {
  conf?: ConfForFrontendUse
  visualisationType?: VisualisationType
  xAxis?: string
  yAxis?: string | string[]
}) {
  const orderSortedConf = conf
    ? Object.keys(conf)
        ?.map((key) => ({
          ...conf[key],
          id: key,
        }))
        ?.sort((a, b) => a.order - b.order)
    : []

  const filteredConfBasedOnYAxes =
    visualisationType === 'line_chart' || visualisationType === 'bar_chart'
      ? orderSortedConf.filter(
          (conf) => yAxis?.includes(conf.id) || conf.id === xAxis
        )
      : orderSortedConf

  const [confOrder, setConfOrder] = React.useState(filteredConfBasedOnYAxes)

  const orderSortedFormValues: ConfObjectWithId = Object.fromEntries(
    confOrder.map((conf, index) => [conf.id, { ...conf, order: index }])
  )
  return { confOrder, setConfOrder, orderSortedFormValues }
}
