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

interface IRadialChartProps {
  title: string
  data: VisualisationData
  xField: string
  yField: string
  options?: ApexCharts.ApexOptions
  width?: string | number
  height?: string | number
  className?: string
  customColors?: string[]
  colorTheme?: string[]
  isDashboard?: boolean
  conf: Record<string, tDataConfig>
  error: any
}

export default function PieChart({
  xField,
  yField,
  data,
  customColors,
  title,
  width,
  height,
  colorTheme,
  isDashboard,
  conf,
  error,
}: IRadialChartProps) {
  const chartData = React.useMemo(
    () => (Array?.isArray(data) ? data : []),
    [data]
  )
  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })

  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: chartData,
    xField,
    yField,
  })

  const isYFieldAValidNumber = areAllFieldsValidNumber({ yField, conf })

  const customTooltipFunction = React.useCallback(
    ({
      series,
      seriesIndex,
      w,
    }: {
      series: any
      seriesIndex: number
      _: any
      w: { config: any; globals: any }
    }) => {
      const label = w.globals.labels[seriesIndex]
      const value = series[seriesIndex]
      const formattedValue = conf
        ? conf?.[yField]?.prefix +
          parseFloat(value).toFixed(conf?.[yField].decimal_places) +
          conf?.[yField]?.suffix
        : value
      const labelColor = w.globals.colors[seriesIndex]

      return `<div
              style="background: ${labelColor};padding: 5px 10px"
            >
            <span>${label}: ${formattedValue}</span>
            </div>`
    },
    [conf, yField]
  )

  const state: { options: ApexCharts.ApexOptions } = React.useMemo(
    () => ({
      options: {
        legend: {
          position: 'bottom' as const,
          horizontalAlign: 'center' as const,
        },
        title: {},
        colors: customColors ?? (colorTheme as string[]),
        labels: chartData?.map((item) => startCase(item[xField])),
        plotOptions: {
          radialBar: {
            hollow: {
              size: '65%',
            },
            tooltip: {
              // y: {
              //   formatter: (val: any) => {
              //     if (conf) {
              //       return (
              //         conf?.[yField]?.prefix +
              //         // '$' + //these hardcoded values just works fine
              //         parseFloat(val).toFixed(conf?.[yField].decimal_places) +
              //         // '%'
              //         conf?.[yField]?.suffix
              //       )
              //     }
              //     return val
              //   },
              // },
              custom: customTooltipFunction,
            },
          },
        },
      },
    }),
    [chartData, colorTheme, customColors, customTooltipFunction, xField]
  )

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
      <h4 className="cardTitle pie" ref={titleRef}>
        {startCase(title)}
      </h4>
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : isXFieldValid && isYFieldValid && isYFieldAValidNumber ? (
        <ReactApexChart
          options={state.options}
          series={series}
          type="pie"
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
