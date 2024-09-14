import startCase from 'lodash/startCase'
import React, { useMemo, useRef } from 'react'
import ReactApexChart from 'react-apexcharts'

import useChartResizeObserver from '../../helpers/useChartResizeObserver'
import { chartDefaultOptions } from '../utils/chartsCommon'
interface IBarChartProps {
  data: any[]
  title: string
  xField: string
  yField: string
  width?: string | number
  height?: string | number
  className?: string
  customColors?: string[]
  colorTheme?: string[]
  isDashboard?: boolean
}

const ColumnChart = ({
  data,
  xField,
  yField,
  title,
  width,
  height,
  customColors,
  colorTheme,
  isDashboard,
}: IBarChartProps) => {
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })
  const generatedCategories = useMemo(() => {
    const dataArray = Object.values(data[0])?.find((value) =>
      Array.isArray(value)
    ) as any[]
    return dataArray?.map((item) => item[xField])
  }, [data, xField])
  const options = {
    title: {},
    colors: customColors ?? (colorTheme as string[]),
    chart: chartDefaultOptions(title),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: generatedCategories,
    },
    fill: {
      opacity: 1,
    },
  }
  const series = data?.map((item) => {
    let title = ''
    const dataArray = Object.values(item)?.find((value) => {
      if (!Array.isArray(value)) {
        title = value as string
        return false
      } else return true
    }) as any[]
    return { title, data: dataArray?.map((item) => item[yField]) }
  })

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <h4 ref={titleRef}>{startCase(title)}</h4>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width={chartDimensions.width}
        height={chartDimensions.height}
      />
    </div>
  )
}

export default ColumnChart
