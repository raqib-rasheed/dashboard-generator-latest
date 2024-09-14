import { Empty } from 'antd'
import startCase from 'lodash/startCase'
import * as React from 'react'
import ReactApexChart from 'react-apexcharts'

import { VisualisationData } from '~/refactored/features/widgets/create-widget/api'

import { areAllFieldsValidNumber } from '../../../utils/areAllFieldsValidNumber'
import { checkIfXYFieldsAreValid } from '../../../utils/checkIfXYFieldsAreValid'
import useChartResizeObserver from '../../helpers/useChartResizeObserver'
import { ErrorElement } from '../ErrorElement'
import { tDataConfig } from '../types/customTypes'
import { chartDefaultOptions } from '../utils/chartsCommon'
interface IDonutChartProps {
  title: string
  data?: VisualisationData
  options?: ApexCharts.ApexOptions
  width?: string | number
  height?: string | number
  customColors?: string[]
  colorTheme?: string[]
  yField: string
  xField: string
  isDashboard?: boolean
  conf: Record<string, tDataConfig>
  error: any
}

const DonutChart = ({
  title,
  data,
  options,
  width,
  height,
  customColors,
  colorTheme,
  yField,
  xField,
  isDashboard,
  conf,
  error,
}: IDonutChartProps) => {
  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })
  const chartData = Array?.isArray(data) ? data : []

  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: chartData,
    xField,
    yField,
  })

  const isYFieldAValidNumber = areAllFieldsValidNumber({ yField, conf })

  const series = chartData
    ?.map((item) => {
      if (item[yField]) {
        return item[yField]
      }
      return null
    })
    ?.filter((item) => item !== null)

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h4 className="cardTitle donut" ref={titleRef}>
        {startCase(title)}
      </h4>
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : isXFieldValid && isYFieldValid ? (
        <ReactApexChart
          options={{
            legend: {
              position: 'bottom' as const,
              horizontalAlign: 'center' as const,
            },
            dataLabels: {
              enabled: true,
              dropShadow: {
                enabled: false,
              },
            },
            chart: chartDefaultOptions(title),
            labels: chartData?.map((item) => startCase(item[xField])),
            colors: customColors ?? (colorTheme as string[]),
            title: {},
            tooltip: {
              y: {
                formatter: (val: any) => {
                  if (conf) {
                    return (
                      conf[yField]?.prefix +
                      // '$' + //these hardcoded values just works fine
                      parseFloat(val).toFixed(conf?.[yField].decimal_places) +
                      // '%'
                      conf?.[yField]?.suffix
                    )
                  }
                  return val
                },
              },
            },
            ...options,
          }}
          series={series}
          type="donut"
          width={chartDimensions.width}
          height={chartDimensions.height}
        />
      ) : !isYFieldAValidNumber ? (
        <Empty description="Value field selected must be a valid number!" />
      ) : (
        <Empty description="Please verify whether Label and Value fields are correctly entered" />
      )}
    </div>
  )
}
export default React.memo(DonutChart)
