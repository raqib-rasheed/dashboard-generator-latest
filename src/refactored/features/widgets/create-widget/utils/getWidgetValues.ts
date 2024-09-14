import { UseFormWatch, UseFormGetValues } from 'react-hook-form'

import { Widget } from '../types'

type Props = {
  watch: UseFormWatch<Widget>
  getValues: UseFormGetValues<Widget>
}

export function getWidgetValues({ watch, getValues }: Props) {
  const visualisationType = watch('visualisationType')

  const values = getValues()
  // doesWidgetContainAxisValueDetails could have been used, but following is done to get type access to the axis details
  const hasAxisAndValue =
    values.visualisationType === 'line_chart' ||
    values.visualisationType === 'bar_chart' ||
    values.visualisationType === 'donut_chart' ||
    values.visualisationType === 'pie_chart'

  const xAxis = hasAxisAndValue ? values.xAxis : ''
  const yAxis = hasAxisAndValue ? values.yAxis : ''
  const title = values.title

  return { visualisationType, xAxis, yAxis, title }
}
