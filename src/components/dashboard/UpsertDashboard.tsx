/* eslint-disable prettier/prettier */
import { LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  notification,
  Row,
  Select,
  Skeleton,
  Spin,
} from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import _ from 'lodash'
import moment from 'moment'
import queryString from 'query-string'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useGetConnections } from '~/refactored/features/connections'
import { useGenerateRedirectParam } from '~/refactored/hooks'

import axiosInstance from '../../axiosInstance'
import useThemeProvider from '../../hooks/ThemeProvider'
import { ReactComponent as CloseIcon } from '../../icons/dashboard-preview-page/closeIcon.svg'
import WidgetSelectorPanel from '../widgets/WidgetSelectorPanel'

import Dashboard from './Dashboard'
import DashboardThemeSelector from './DashboardThemeSelector'
import SaveDashboardFilterModalButton, {
  DashboardFilterFormValues,
} from './SaveDashboardFilterModalButton'

import './_styles.scss'

export default function UpsertDashboard() {
  const [dashboardFilters, setDashboardFilters] = useState<
    DashboardFilterFormValues[]
  >([])

  const [widgetsAddedToCanvas, setWidgetsAddedToCanvas] = useState<any[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSubmitting, handleIsSubmitting] = useState(false)
  // No UI updation needed with respect to the
  // Layout change as of now, used ref to avoid renders
  const dashboardLayoutRef = useRef<any>({})
  const location = useLocation()
  const navigate = useNavigate()
  const { colorThemes, colors, setSelectedTheme, selectedTheme } =
    useThemeProvider(dashboardLayoutRef.current?.dashboardTheme)
  const urlParams = queryString.parse(location.search)
  const dashboardId = urlParams?.id

  const redirectTo = useGenerateRedirectParam()

  const [form] = useForm()
  const currentSelectedConnection = useWatch('connection', form)

  const { data: connectionsList, isLoading: isLoadingConnectionList } =
    useGetConnections()

  const [editDashboardDetailsLoading, setEditDashboardDetailsLoading] =
    React.useState(false)

  const { refetch: fetchEditDashboardDetails } = useQuery(
    'dashboardDetails',
    getDashboardDetails,
    {
      enabled: false,
    }
  )

  async function getDashboardDetails() {
    setEditDashboardDetailsLoading(true)
    let data: any
    try {
      data = await axiosInstance({
        method: 'GET',
        url: `/api/v0.1/dashboards/${dashboardId}/preview_dashboard/`,
      })
    } catch (error) {
      notification.destroy()
      notification.error({
        message:
          'Navigating back to homepage. Error occurred when fetching dashboard details!',
        description: (
          <>
            <br />
            <p>{(error as any).response.data['error']}</p>
          </>
        ),
      })
      navigate('/')
    }
    setEditDashboardDetailsLoading(false)
    if (data?.status === 200) {
      form.setFieldsValue({
        name: data?.data?.name,
        connection: data?.data?.connection,
      })
      if (!_.isEmpty(data?.data?.conf)) {
        dashboardLayoutRef.current = data.data.conf
        setSelectedTheme(data.data.conf?.dashboardTheme)
        const dashboardFilters =
          data.data?.dashboard_filters?.map((filter: any) => {
            const filterValues = {
              filterName: filter.filter_name,
              filterType: filter.type,
              defaultValue:
                filter.type === 'date'
                  ? moment(filter.default_value)
                  : filter.type === 'date_range'
                  ? filter.default_value
                      .split('_')
                      .map((val: string) => moment(val))
                  : filter.type === 'range'
                  ? filter.default_value.split('_')
                  : filter.default_value,
            }
            if (filter.type === 'range') {
              ;(filterValues as any)['range'] = {
                lowerValue: filterValues.defaultValue[0],
                higherValue: filterValues.defaultValue[1],
              }
            }
            filter.dashboard_widget_filter_maps.forEach((map: any) => {
              ;(filterValues as any)[`fieldToBeMappedTo_${map?.widget}`] =
                map?.widget_filter_id
            })
            return filterValues
          }) ?? []
        setDashboardFilters(dashboardFilters)
        setWidgetsAddedToCanvas(
          dashboardLayoutRef.current?.widgetsOrder?.map((widget: any) => {
            const match = data?.data?.widgets?.find(
              (item: any) => item?.id === widget?.id
            )
            return match
          })
        )
      }
    }
    return data?.data
  }

  const handleCloseWidget = useCallback(
    (widgetToCloseIndex: number) => {
      const removedWidgetsList = _.remove(
        widgetsAddedToCanvas,
        (widget, index) => !_.isEqual(widgetToCloseIndex, index)
      )
      setWidgetsAddedToCanvas(removedWidgetsList)
    },
    [widgetsAddedToCanvas]
  )

  const dashboardData = useMemo(() => {
    return widgetsAddedToCanvas?.map((item: any, index: number) => {
      const layout =
        isEditMode && !_.isEmpty(dashboardLayoutRef.current)
          ? dashboardLayoutRef.current[index]
          : {}
      return {
        question: {
          id: item?.id,
          type: item?.visualisation_type,
          title: item?.title,
          data: item?.data,
          error: item?.error,
          xField: item?.conf?.x_axis,
          yField: item?.conf?.y_axis,
          conf: item?.conf?.[`${item?.visualisation_type}_conf`],
          // if no property data, assuming no fetch call made to get widget data
          isLoading: Object.prototype.hasOwnProperty.call(item, 'data')
            ? item?.isLoading
            : true,
          widgetFilters: item?.widget_filters,
        },
        x: index * index,
        y: index,
        w: 3,
        h: 2,
        i: index.toString(),
        minW: 1,
        minH: 1,
        closeIcon: (
          <CloseIcon
            onClick={() => handleCloseWidget(index)}
            className="isClosable"
          />
        ),
        ...layout,
      }
    })
  }, [widgetsAddedToCanvas, isEditMode, handleCloseWidget])

  const getWidgetData = useCallback(async () => {
    const widgetToFetchData: any = widgetsAddedToCanvas?.find(
      (item: any) => !Object.prototype.hasOwnProperty.call(item, 'data')
    )
    if (widgetToFetchData) {
      const { id } = widgetToFetchData
      widgetToFetchData.isLoading = true
      let response
      try {
        response = await axiosInstance({
          method: 'GET',
          url: `/api/v0.1/widgets/${id}/get_widget_data/`,
        })
      } catch (error) {
        widgetToFetchData.isLoading = false
        widgetToFetchData['error'] = (error as any).response.data['error']
        widgetToFetchData['data'] = []
        setWidgetsAddedToCanvas((prevState) =>
          _.map(prevState, (item) =>
            item?.id === id ? widgetToFetchData : item
          )
        )
      }
      widgetToFetchData.isLoading = false
      widgetToFetchData['error'] = null
      // assigning data property to widget
      if (response?.status === 200) {
        widgetToFetchData['data'] = response?.data
      }
      // Update slectedWidgetsState
      setWidgetsAddedToCanvas((prevState) =>
        _.map(prevState, (item) => (item?.id === id ? widgetToFetchData : item))
      )
    }
  }, [widgetsAddedToCanvas])

  async function handleSubmit(formValues: any) {
    handleIsSubmitting(true)
    const widgetIds = widgetsAddedToCanvas?.map((item: any) => ({
      id: item?.id,
    }))
    formValues['widgets'] = widgetIds
    // eslint-disable-next-line no-unsafe-optional-chaining, @typescript-eslint/no-non-null-asserted-optional-chain
    const [key] = Object.entries(colorThemes)?.find((item) =>
      _.isEqual(item[1], colors!)
    )!
    formValues['conf'] = {
      ...dashboardLayoutRef.current,
      widgetsOrder: widgetIds,
      dashboardTheme: key,
    }
    formValues['connection'] = currentSelectedConnection

    formValues['dashboard_filters'] = dashboardFilters.map((filter) => {
      const mappedWidgets = Object.entries(filter)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([key, _]) => key.includes('fieldToBeMappedTo_'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(([_, value]) => ({ widget_filter_id: value }))
        .filter((obj) => obj.widget_filter_id)

      return {
        filter_name: filter.filterName,
        type: filter.filterType,
        default_value:
          filter.filterType === 'date'
            ? (filter.defaultValue as unknown as moment.Moment)?.format(
                'YYYY-MM-DD'
              )
            : filter.filterType === 'date_range'
            ? (filter.defaultValue as unknown as [moment.Moment, moment.Moment])
                .map((val) => val.format('YYYY-MM-DD'))
                .join('_')
            : filter.filterType === 'range'
            ? (filter.defaultValue as [string, string]).join('_')
            : // ? `${(filter as any).range?.lowerValue}_${(filter as any).range
              //     ?.higherValue}`
              filter.defaultValue,
        mapped_widgets: mappedWidgets,
      }
    })

    const isFormValid = () =>
      form.getFieldsError().some((item) => item.errors.length === 0)

    if (isFormValid()) {
      const url = isEditMode
        ? `/api/v0.1/dashboards/${dashboardId}/`
        : '/api/v0.1/dashboards/'
      const method = isEditMode ? 'put' : 'post'
      try {
        const res = await axiosInstance[method](url, formValues)
        handleIsSubmitting(false)
        if (res?.status <= 201) {
          notification.open({
            type: 'success',
            duration: 3,
            message: `Dashboard ${isEditMode ? 'Updated' : 'Created'}`,
            description: `Dashboard successfully ${
              isEditMode ? 'Updated' : 'Created'
            }!`,
          })
          navigate('/')
        } else {
          // handling status > 400 errors!
          handleIsSubmitting(false)
          return notification.open({
            type: 'error',
            duration: 3,
            message: 'Error',
            description: 'Oops! Something went wrong.',
          })
        }
      } catch {
        handleIsSubmitting(false)
        return notification.open({
          type: 'error',
          duration: 3,
          message: 'Error',
          description: 'Oops! Something went wrong.',
        })
      }
    }
  }

  function handleDashboardLayoutChange(newLayout: any) {
    if (!_.isEqual(newLayout, dashboardLayoutRef.current))
      dashboardLayoutRef.current = {
        ...dashboardLayoutRef.current,
        ...newLayout,
      }
  }

  const connectionsOptions = useMemo(() => {
    const options = (connectionsList ?? [])?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    }))
    return options
  }, [connectionsList])

  // To keep track of the data corresponding to the selected widgets
  // ==>> That is, widgets added to canvas.
  useEffect(() => {
    getWidgetData()
  }, [getWidgetData])

  useEffect(() => {
    if (!_.isEmpty(urlParams?.id)) {
      setIsEditMode(true)
      fetchEditDashboardDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams?.id])

  if (isLoadingConnectionList) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spin />
      </div>
    )
  }

  return (
    <>
      <Layout className="upsert-dashboard-layout">
        <Form
          form={form}
          labelWrap
          labelAlign="left"
          style={{ width: '100%' }}
          name="create-dashboard"
          onFinish={handleSubmit}
        >
          <>
            <Row justify="space-between">
              <Col>
                <Row gutter={[10, 10]}>
                  <Col>
                    <Form.Item
                      labelCol={{ span: 11, offset: 0 }}
                      name="name"
                      label="Dashboard Name"
                      rules={[
                        {
                          required: true,
                          message: 'Dashboard name is required!',
                        },
                      ]}
                    >
                      <Input
                        suffix={
                          editDashboardDetailsLoading && <LoadingOutlined />
                        }
                        placeholder="Choose a title for Dashboard"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name="connection"
                      label="Connection"
                      rules={[
                        { required: true, message: 'Connection is required!' },
                      ]}
                    >
                      <Select
                        placeholder="Connection"
                        onChange={() => {
                          setWidgetsAddedToCanvas([])
                        }}
                        style={{ width: '180px', marginLeft: '7px' }}
                        options={connectionsOptions}
                        loading={isLoadingConnectionList}
                      />
                    </Form.Item>
                  </Col>
                  <Link
                    to={{
                      pathname: '/upsert-connection',
                      search: redirectTo,
                    }}
                  >
                    <Button>Add Connection</Button>
                  </Link>
                  <Col>
                    <DashboardThemeSelector
                      setTheme={setSelectedTheme}
                      selectedTheme={selectedTheme}
                    />
                  </Col>
                  <Col>
                    <SaveDashboardFilterModalButton
                      buttonText="Add filter"
                      dashboardData={dashboardData}
                      dashboardFilters={dashboardFilters}
                      setDashboardFilters={setDashboardFilters}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  htmlType="submit"
                  type="primary"
                  ghost
                  icon={<SaveOutlined />}
                >
                  Save
                </Button>
              </Col>
            </Row>
            <div>
              <Row style={{ minHeight: '300px' }}>
                {isEditMode && editDashboardDetailsLoading ? (
                  <Skeleton />
                ) : (
                  <>
                    <Col span={24}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        {dashboardFilters.map((dash, idx) => (
                          <SaveDashboardFilterModalButton
                            key={dash.filterName}
                            buttonText={dash.filterName}
                            initialValues={dash}
                            dashboardData={dashboardData}
                            currentFilter={idx}
                            dashboardFilters={dashboardFilters}
                            setDashboardFilters={setDashboardFilters}
                          />
                        ))}
                      </div>
                      <Dashboard
                        colorTheme={colors}
                        onLayoutChange={handleDashboardLayoutChange}
                        dashboard={dashboardData}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </div>
            {/* {contextHolder} */}
          </>
        </Form>
        <WidgetSelectorPanel
          connectionsList={connectionsList ?? []}
          setWidgetsAddedToCanvas={setWidgetsAddedToCanvas}
          selectedConnection={currentSelectedConnection}
        />
      </Layout>
    </>
  )
}
