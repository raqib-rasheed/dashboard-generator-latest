import { Table as AntdTable, Typography, Tooltip } from 'antd'
import dayjs from 'dayjs'
import capitalize from 'lodash/capitalize'
import startCase from 'lodash/startCase'
import * as React from 'react'

import { VisualisationData } from '~/refactored/features/widgets/create-widget/api'
import { isDate } from '~/refactored/features/widgets/create-widget/utils'

import './style.scss'

const { Text } = Typography
interface iTableProps {
  data: VisualisationData
  excludedFields: any[]
  style?: React.CSSProperties | undefined
  className?: string
  title: string
  cellWidth?: number
}

interface iTruncateTextProps {
  text: string
}

function TruncateText({ text }: iTruncateTextProps) {
  return (
    <>
      {text ? (
        <Text>
          {text.slice(0, 50)}
          {text.length > 50 && (
            <Tooltip placement="top" title={text}>
              ...
            </Tooltip>
          )}
        </Text>
      ) : (
        ''
      )}
    </>
  )
}
export default function Table({
  data,
  style,
  className,
  title,
  excludedFields,
}: // cellWidth = 200,
iTableProps) {
  const chartData = Array?.isArray(data) ? data : [{}]
  function getColumns() {
    const dataKeys = Object.keys(chartData[0])?.filter(
      (item) => !excludedFields?.includes(item)
    )
    return dataKeys.map((item: any) => {
      const v: any = {
        title: startCase(item),
        dataIndex: item,
        key: item,
        render: (text: any) => {
          if (isDate(text)) {
            return (
              <span className={dayjs(text).format('YYYY/MM/DD')}>{text}</span>
            )
          }
          return (
            <span className={item}>
              {typeof text === 'string' ? <TruncateText text={text} /> : text}
            </span>
          )
        },
      }
      return v
    })
  }
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <h4>{capitalize(title)}</h4>
      <div
        style={{
          height: 'calc(100% - 55px)',
          width: '100%',
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      >
        <AntdTable
          pagination={{ hideOnSinglePage: true }}
          tableLayout="auto"
          style={style}
          className={className ? `${className} tableWidget` : 'tableWidget'}
          dataSource={chartData}
          columns={getColumns()}
        />
      </div>
    </div>
  )
}
