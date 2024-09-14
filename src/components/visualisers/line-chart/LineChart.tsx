import { Empty } from 'antd'
import dayjs from 'dayjs'
import { humanize } from 'inflection'
import startCase from 'lodash/startCase'
import * as React from 'react'
import ReactApexChart from 'react-apexcharts'

import { VisualisationData } from '~/refactored/features/widgets/create-widget/api'
import { isDate } from '~/refactored/features/widgets/create-widget/utils'

import { areAllFieldsValidNumber } from '../../../utils/areAllFieldsValidNumber'
import { checkIfXYFieldsAreValid } from '../../../utils/checkIfXYFieldsAreValid'
import useChartResizeObserver from '../../helpers/useChartResizeObserver'
import { ErrorElement } from '../ErrorElement'
import { tDataConfig } from '../types/customTypes'
import { chartDefaultOptions } from '../utils/chartsCommon'

interface iLineChartProps {
  title: string
  xField: string
  yField: string[]
  width?: string | number
  height?: string | number
  data: VisualisationData
  style?: React.CSSProperties | undefined
  className?: string
  customColors?: string[]
  colorTheme?: string[]
  conf: Record<string, tDataConfig>
  isDashboard?: boolean
  error: any
}
export default function LineChart({
  title,
  xField,
  yField,
  data,
  height,
  className,
  customColors,
  width,
  colorTheme,
  conf,
  isDashboard,
  error,
}: iLineChartProps) {
  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })
  const chartData = Array?.isArray(data) ? data : []

  const areAllYfieldsAValidNumber = areAllFieldsValidNumber({ yField, conf })

  const series =
    typeof yField === 'string'
      ? [
          {
            name: title,
            data: chartData?.map((item) => item?.[yField]),
          },
        ]
      : yField
          ?.map((field) => ({
            name: humanize(startCase(conf ? conf[field]?.column_name : field)),
            data: chartData
              ?.map((item) => {
                if (Object.prototype.hasOwnProperty.call(item, field)) {
                  return item[field]
                }
                return null
              })
              .filter((item) => item !== null),
          }))
          .filter((field) => field.data.length > 0)

  const options = {
    title: {},
    markers: {
      size: 6,
      strokeWidth: 3,
      fillOpacity: 0,
      strokeOpacity: 0,
      hover: {
        size: 8,
      },
    },
    colors: customColors ?? (colorTheme as string[]),
    // colors: ["#E55572", "#f28e30", "#F9B114"],
    chart: chartDefaultOptions(title),
    grid: {
      row: {
        colors: ['#fafafa', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.3,
      },
    },
    stroke: {
      width: 5,
      curve: 'smooth' as any,
    },
    xaxis: {
      categories: chartData?.map((item) => {
        const xValue = item?.[xField]
        if (isDate(xValue)) {
          return dayjs(xValue).format(
            conf?.[xField] ? conf?.[xField]?.format : 'DD MMM YY'
          )
        }
        return xValue
      }),
      title: {
        text: conf
          ? humanize(startCase(conf[xField]?.column_name))
          : humanize(startCase(xField)),
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis:
      typeof yField === 'string'
        ? {
            labels: {
              formatter: (val: string) => {
                if (conf?.[yField])
                  return (
                    conf[yField]?.prefix +
                    parseFloat(val).toFixed(conf[yField]?.decimal_places) +
                    conf[yField]?.suffix
                  )
                return val
              },
            },
            title: {
              text: conf
                ? humanize(startCase(conf[yField]?.column_name))
                : humanize(startCase(yField)),
            },
          }
        : yField?.map((field, idx) => ({
            title: {
              text: humanize(
                startCase(conf ? conf[field]?.column_name : field)
              ),
            },
            opposite: idx % 2 !== 0 ? true : false,
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: true,
            },
            labels: {
              formatter: (val: string) => {
                if (conf?.[field])
                  return (
                    conf[field]?.prefix +
                    parseFloat(val).toFixed(conf[field]?.decimal_places) +
                    conf[field]?.suffix
                  )
                return val
              },
            },
          })),
  }

  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: chartData,
    xField,
    yField,
  })

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
      <h4 className="cardTitle line" ref={titleRef}>
        {startCase(title)}
      </h4>
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : isXFieldValid && isYFieldValid && areAllYfieldsAValidNumber ? (
        <ReactApexChart
          className={className}
          options={options as any}
          series={series}
          type="line"
          width={chartDimensions.width}
          height={chartDimensions.height}
        />
      ) : !areAllYfieldsAValidNumber ? (
        <Empty description="Y Axis fields selected must be a valid number!" />
      ) : (
        <Empty description="Please verify whether X Axis and Y Axis fields are correctly entered!" />
      )}
    </div>
  )
}
