import startCase from 'lodash/startCase'
import * as React from 'react'
import ReactApexChart from 'react-apexcharts'

import useChartResizeObserver from '../../helpers/useChartResizeObserver'

interface IRadialChartProps {
  title: string
  data: any[]
  xField: string
  yField: string
  options?: ApexCharts.ApexOptions
  width?: string | number
  height?: string | number
  className?: string
  customColors?: string[]
  colorTheme?: string[]
  isDashboard?: boolean
}

export default function RadialChart({
  xField,
  yField,
  data,
  customColors,
  title,
  width,
  height,
  colorTheme,
  isDashboard,
}: IRadialChartProps) {
  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })
  const state = {
    options: {
      title: {},
      colors: customColors ?? (colorTheme as string[]),
      labels: data?.map((item) => item && item[xField as any]),
      plotOptions: {
        radialBar: {
          hollow: {
            size: '65%',
          },
        },
      },
    },
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <h4 ref={titleRef}>{startCase(title)}</h4>
      <ReactApexChart
        options={state.options}
        series={data?.map((item) => item[yField as any])}
        type="radialBar"
        width={chartDimensions.width}
        height={chartDimensions.height}
      />
    </div>
  )
}
