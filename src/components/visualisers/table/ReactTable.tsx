import EyeOutlined from '@ant-design/icons/EyeOutlined'
import { Typography, Tooltip, Image } from 'antd'
import dayjs from 'dayjs'
import startCase from 'lodash/startCase'
import * as React from 'react'
import { useTable, Column } from 'react-table'

import './style.scss'
import { ErrorElement } from '../ErrorElement'
import { tDataConfig } from '../types/customTypes'

const { Text } = Typography

interface iTableProps {
  data: any[]
  style?: React.CSSProperties | undefined
  className?: string
  title: string
  conf: Record<string, tDataConfig>
  error: any
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

export default function ReactTable({
  data,
  className,
  title,
  conf,
  error,
}: iTableProps) {
  const tableData = React.useMemo(
    () => (Array.isArray(data) ? data : [{}]),
    [data]
  )

  const orderSortedOnlyVisibleConfKeys = React.useMemo(
    () =>
      Object.keys(conf ? conf : {})
        ?.map((key) => ({
          ...conf[key],
          id: key,
        }))
        ?.filter((key) =>
          Object.prototype.hasOwnProperty.call(key, 'isVisible')
            ? key.isVisible
            : true
        )
        ?.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
        ?.map((key) => key?.id),
    [conf]
  )

  // Define the columns of the table
  const columns: Column<any>[] = React.useMemo(
    () => [
      ...orderSortedOnlyVisibleConfKeys.map((key) => ({
        Header: startCase((conf && conf[key]?.column_name) ?? key),
        accessor: key,
        Cell: ({ value }: { value: any }) => {
          if (conf && conf[key]?.data_type === 'image') {
            //#TODO:Need to use Proxy to render
            return (
              <>
                {value ? (
                  <Image
                    className={key}
                    width={30}
                    src={value}
                    preview={{
                      height: '600px',
                      mask: <EyeOutlined />,
                    }}
                  />
                ) : (
                  ''
                )}
              </>
            )
          } else if (conf && conf[key]?.data_type === 'number') {
            return (
              <>
                {value ? (
                  <span className={key}>
                    {conf[key].prefix}
                    {parseFloat(value).toFixed(conf[key].decimal_places)}
                    {conf[key].suffix}
                  </span>
                ) : (
                  ''
                )}
              </>
            )
          } else if (conf && conf[key]?.data_type === 'rating') {
            return <>{value ? <span className={key}>{value}</span> : ''}</>
          } else if (conf && conf[key]?.data_type === 'date') {
            return (
              <span className={key}>
                {value ? dayjs(value).format(conf[key].format) : ''}
              </span>
            )
          }
          return (
            <span className={key}>
              {typeof value === 'string' ? (
                <TruncateText text={value} />
              ) : (
                value
              )}
            </span>
          )
        },
      })),
    ],
    [orderSortedOnlyVisibleConfKeys, conf]
  )

  // Define the table instance using the useTable hook
  const tableInstance = useTable<any>({ columns, data: tableData })

  // Extract the necessary props from the table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <div
      className="tableCard"
      style={{
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h4 className="cardTitle rTable">{startCase(title)}</h4>
      {error ? (
        <ErrorElement error={error} styles={{ flex: 1 }} />
      ) : (
        <div className="table-container ">
          <table
            {...getTableProps()}
            className={className ? `${className} table-widget` : 'table-widget'}
          >
            <thead>
              {headerGroups.map((headerGroup: any, idx) => (
                <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any, idx: number) => (
                    <th key={idx} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row: any, idx) => {
                prepareRow(row)
                return (
                  <tr key={idx} {...row.getRowProps()}>
                    {row.cells.map((cell: any, idx: number) => (
                      <td key={idx} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
