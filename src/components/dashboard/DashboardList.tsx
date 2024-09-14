import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Col, Row, Table } from 'antd'
import queryString from 'query-string'
import * as React from 'react'
import { useQuery } from 'react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './_styles.scss'
import axiosInstance from '../../axiosInstance'
import { ReactComponent as EditIcon } from '../../icons/dashboard-list-page/pencil.svg'

export default function DashboardList() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchQueries = queryString.parse(location.search, {
    parseNumbers: true,
  })
  const [tableHeight, setTableHeight] = React.useState(calculateTableHeight())

  const currentPage = (searchQueries?.page as number | undefined) ?? 1
  const {
    data: response,
    isLoading,
    error,
  } = useQuery(['dashboards', currentPage], () =>
    getDashboardsList(currentPage)
  )

  async function getDashboardsList(page: number) {
    const data = await axiosInstance({
      method: 'GET',
      url: `/api/v0.1/dashboards/?page=${page}`,
    })
    return data
  }
  const columns = React.useMemo(() => {
    return [
      {
        title: 'Dashboard Name',
        key: 'dashboardName',
        dataIndex: 'name',
        width: '42%',
        render: (value: any, entireItem: any) => (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={`/preview-dashboard/${entireItem?.id}`}
            className="dashboard-names"
          >
            {value}
          </Link>
        ),
      },
      {
        title: 'Connection',
        key: 'connection',
        dataIndex: 'connection',
        width: '32%',
        render: (item: any) => {
          return item?.name
        },
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '22%',
        render: (value: any, entireItem: any) => {
          return (
            <Link to={`/upsert-dashboard?id=${entireItem?.id}`}>
              <EditIcon className="cursor-pointer tableEditIcon" />
            </Link>
          )
        },
      },
    ]
  }, [])

  function handlePagination(page: number) {
    navigate({ search: queryString.stringify({ ...searchQueries, page }) })
  }

  function handleResize() {
    setTableHeight(calculateTableHeight())
  }

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)
    return function removeEventListener() {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Row className="mb-10" justify="space-between">
        <Col>
          <Link to="/upsert-dashboard">
            <Button type="primary" ghost icon={<PlusCircleOutlined />}>
              Dashboard
            </Button>
          </Link>
        </Col>
        <Col>
          <Link to="/upsert-connection">
            <Button
              type="primary"
              ghost
              icon={<PlusCircleOutlined />}
              className="mr-5 "
            >
              Connection
            </Button>
          </Link>
          <Link to="/upsert-widget">
            <Button type="primary" ghost icon={<PlusCircleOutlined />}>
              Widget
            </Button>
          </Link>
        </Col>
      </Row>
      {error ? (
        'Oops...! somthing went wrong.'
      ) : (
        <Table
          rowKey="id"
          className="scrollableContainer"
          scroll={{ y: tableHeight }}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: 20,
            total: response?.data?.count ?? 0,
            hideOnSinglePage: true,
            showSizeChanger: false,
            showLessItems: true,
            showPrevNextJumpers: true,
            onChange: handlePagination,
          }}
          dataSource={response?.data?.results ?? []}
          columns={columns}
        />
      )}
    </>
  )
}

function calculateTableHeight() {
  const windowHeight = document.body.clientHeight
  const headerHeight =
    document.querySelector('.ant-layout-header')?.clientHeight ?? 0
  const bottomSpaceToLeave = 250
  return windowHeight - headerHeight - bottomSpaceToLeave
}
