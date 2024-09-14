export type IChartTypes =
  | 'area'
  | 'line'
  | 'bar'
  | 'histogram'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'boxPlot'
  | 'candlestick'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | undefined

export type tDataConfig = {
  data_type: 'number' | 'date' | 'text' | 'image' | 'rating' | 'link'
  column_name: string
  decimal_places?: number
  format?: string
  prefix?: string
  suffix?: string
  href?: string
  isVisible?: boolean
  order?: number
}
