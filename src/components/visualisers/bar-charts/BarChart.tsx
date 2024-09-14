import { Empty } from 'antd'
import dayjs from 'dayjs'
import { humanize } from 'inflection'
import startCase from 'lodash/startCase'
import * as React from 'react'
import ReactApexChart from 'react-apexcharts'

import { VisualisationData } from '~/refactored/features/widgets/create-widget/api'

import { areAllFieldsValidNumber } from '../../../utils/areAllFieldsValidNumber'
import { checkIfXYFieldsAreValid } from '../../../utils/checkIfXYFieldsAreValid'
import useChartResizeObserver from '../../helpers/useChartResizeObserver'
import { ErrorElement } from '../ErrorElement'
import { chartDefaultOptions } from '../utils/chartsCommon'

interface IBarChartProps {
  data: VisualisationData
  title: string
  xField: string
  yField: string[]
  width?: string | number
  height?: string | number
  className?: string
  customColors?: string[]
  colorTheme?: string[]
  isDashboard?: boolean
  conf: any
  error: any
}

const BarChart = ({
  data,
  xField,
  yField,
  title,
  width,
  height,
  customColors,
  colorTheme,
  isDashboard,
  conf,
  error,
}: IBarChartProps) => {
  const direction = conf?.['direction'] ?? 'horizontal'

  const titleRef = React.useRef<HTMLHeadingElement | null>(null)
  const { containerRef, chartDimensions } = useChartResizeObserver({
    defaultWidth: width ?? '100%',
    defaultHeight: height ?? '500px',
    titleRef,
    isDashboard,
  })
  const chartData = Array?.isArray(data) ? data : []
  const options /* : ApexCharts.ApexOptions */ = {
    colors: customColors ?? (colorTheme as string[]),
    chart: chartDefaultOptions(title),
    dataLabels: {
      enabled: false,
    },
    title: {
      // text: startCase(title),
      // style: {
      //   fontFamily: 'Lexend Deca, sans-serif',
      // },
    },

    grid: {
      row: {
        colors: ['#fafafa', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.3,
      },
    },
    xaxis: {
      categories: chartData.map((item) => {
        const xValue = item[xField]
        if (conf?.[xField] && conf[xField]?.data_type === 'date') {
          return dayjs(xValue).format(conf ? conf[xField].format : 'DD MMM YY')
        }
        return xValue
      }),
      title: {
        text:
          Array.isArray(yField) && yField.length === 1
            ? humanize(startCase(conf?.[yField[0]]?.column_name ?? yField[0]))
            : typeof yField === 'string'
              ? humanize(startCase(conf?.[yField]?.column_name ?? yField))
              : '',
      },
    },
    yaxis: {
      title: {
        text: humanize(startCase(conf?.[xField]?.column_name ?? xField)),
      },
    },
  }
  const series =
    typeof yField === 'string'
      ? [
          {
            name: title,
            data: chartData?.map((item) => item[yField]),
          },
        ]
      : yField
          ?.map((field) => ({
            name: humanize(startCase(conf[field]?.column_name ?? field)),
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

  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: chartData,
    xField,
    yField,
  })

  const areAllYfieldsAValidNumber = areAllFieldsValidNumber({ yField, conf })

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
      <h4 className="cardTitle bar" ref={titleRef}>
        {startCase(title)}
      </h4>
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : isXFieldValid && isYFieldValid && areAllYfieldsAValidNumber ? (
        <ReactApexChart
          options={{
            plotOptions: {
              bar: {
                horizontal: direction === 'horizontal',
              },
            },
            fill: {
              opacity: 1,
              type: 'solid',
            },
            ...(options as any),
          }}
          series={series}
          type="bar"
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

export default BarChart
