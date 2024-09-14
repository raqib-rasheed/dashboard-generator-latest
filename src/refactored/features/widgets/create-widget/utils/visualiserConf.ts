export type tVisualiserConfiguration = {
  bar_chart?: {
    direction: string
    stacked: boolean
  }
  line_chart?: {
    color: string
  }
}
const VisualiserConfMap: tVisualiserConfiguration = {
  bar_chart: {
    direction: 'horizontal',
    stacked: false,
  },
}
function isValidVisualiserKey(
  key: string
): key is keyof tVisualiserConfiguration {
  return key === 'bar_chart' || key === 'line_chart'
}
export { VisualiserConfMap, isValidVisualiserKey }
