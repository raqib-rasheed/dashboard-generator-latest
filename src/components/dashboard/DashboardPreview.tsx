import './_styles.scss'

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Row,
  Slider,
  Spin,
  Typography,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
// import { AppContext } from '../..'
import moment from 'moment'
import queryString from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { WidgetFilterType } from '~/refactored/features/widgets/create-widget/types'

import axiosInstance from '../../axiosInstance'
import useThemeProvider from '../../hooks/ThemeProvider'

import Dashboard from './Dashboard'
import DashboardTitle from './simple-components/DashboardTitle'

type DashboardFilterMapBackend = {
  id: number
  widget_variable_mapped: string
  widget_filter_id: number
  widget: number
  dashboard_filter: number
}

type DashboardFilterBackend = {
  id: number
  dashboard: number
  filter_name: string
  type: WidgetFilterType
  default_value: string
  options_query: null | any
  dashboard_widget_filter_maps: DashboardFilterMapBackend[]
}

export default function DashboardPreview() {
  const [defaultValueMapForFilters, setDefaultValueMapForFilters] = useState<
    Record<string, string>
  >({})

  const [form] = useForm()
  const { colorThemes } = useThemeProvider()
  const location = useLocation()
  const navigate = useNavigate()
  const searchQueries = queryString.parse(location.search)

  const dashboardFiltersFromSearchQueries =
    (searchQueries?.dashboard_filters as string | undefined)
      ? queryString.parse(searchQueries?.dashboard_filters as string)
      : {}

  const dashboardFilterMapFromUrl = Object.entries(
    dashboardFiltersFromSearchQueries
  ).map(([key, value]) => {
    const [name, type, possible3rd] = key.split('_')
    const isDateRange = `${type}_${possible3rd}` === '$date_range'

    const lowerValue = (value as string).split('_')[0]
    const higherValue = (value as string).split('_')[1]

    return [
      isDateRange ? `${name}_$date_range` : `${name}_${type}`,
      type === '$date' && !isDateRange
        ? moment(value as string)
        : isDateRange
          ? [moment(lowerValue), moment(higherValue)]
          : type === '$range'
            ? [+lowerValue, +higherValue]
            : value,
    ]
  })

  const dashboardFilterValuesFromUrl = Object.fromEntries(
    dashboardFilterMapFromUrl
  )

  useEffect(() => {
    form.setFieldsValue(dashboardFilterValuesFromUrl)
  }, [dashboardFilterValuesFromUrl, form])

  // const appContext = useContext(AppContext)

  const dashboardId = location.pathname?.split('/').slice(-1)[0]

  const searchParamsMapForBackend = Object.entries(
    dashboardFiltersFromSearchQueries
  ).map(([key, value]) => {
    const [name] = key.split('_')
    if (
      value?.includes('_') &&
      (!(value as string).split('_')[0] || !(value as string).split('_')[1])
    ) {
      return `${name}=${defaultValueMapForFilters[name]}`
    }
    return `${name}=${value ? value : defaultValueMapForFilters[name]}`
  })

  const searchParamsForBackend =
    searchParamsMapForBackend.length > 0
      ? searchParamsMapForBackend.join('&')
      : ''

  const { data: dashboardData, isLoading } = useQuery(
    ['dashboardDetails', searchParamsForBackend],
    () => getDashboardDetails(searchParamsForBackend),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onError: () => {
        navigate(location.pathname)
        notification.error({
          message:
            "There's an error fetching dashboard preview. Please try adjusting filter values if present!",
          duration: 3,
        })
      },
    }
  )

  async function getDashboardDetails(searchParams: string) {
    const url = `/api/v0.1/dashboards/${dashboardId}/preview_dashboard/${
      searchParams ? `?${searchParams}` : ''
    }`
    const data = await axiosInstance({
      method: 'GET',
      url: url,
    })
    return data?.data
  }

  const dashboardFilters = useMemo(() => {
    const dashboardFiltersFromBackend =
      (dashboardData?.dashboard_filters as DashboardFilterBackend[]) ?? []

    const defaultValueFilterMap = Object.fromEntries(
      dashboardFiltersFromBackend.map((filter) => [
        filter.filter_name,
        filter.default_value,
      ])
    )
    if (dashboardFiltersFromBackend?.length > 0) {
      setDefaultValueMapForFilters(defaultValueFilterMap)
    }
    return dashboardFiltersFromBackend.map((filter: DashboardFilterBackend) => {
      const {
        id,
        type,
        filter_name: name,
        default_value,
        dashboard_widget_filter_maps,
      } = filter

      const filterValue = {
        id,
        type,
        name,
        defaultValue:
          type === 'date'
            ? moment(default_value)
            : type === 'date_range'
              ? default_value.split('_').map((val: string) => moment(val))
              : type === 'range'
                ? default_value.split('_')
                : default_value,
        widgetFilterMaps: dashboard_widget_filter_maps.map((map) => {
          const { widget: widgetId, widget_filter_id: widgetFilterId } = map
          return {
            widgetId,
            widgetFilterId,
          }
        }),
      }

      if (type === 'range') {
        ;(filterValue as any)['range'] = {
          lowerValue: (filterValue.defaultValue as [string, string])[0],
          higherValue: (filterValue.defaultValue as [string, string])[1],
        }
      }

      return filterValue
    })
  }, [dashboardData])

  const dashboardLayoutData = useMemo(() => {
    return dashboardData?.conf?.widgetsOrder?.map(
      (widget: any, index: number) => {
        const conf = dashboardData?.conf[index]
        const match = dashboardData?.widgets?.find(
          (item: any) => item?.id === widget?.id
        )
        return {
          question: {
            type: match?.visualisation_type,
            title: match?.title,
            data: match?.data,
            xField: match?.conf?.x_axis,
            yField: match?.conf?.y_axis,
            conf:
              match?.conf && match?.conf[`${match?.visualisation_type}_conf`],
          },
          x: conf?.x,
          y: conf?.y,
          w: conf?.w,
          h: conf?.h,
          i: conf?.i,
          static: true,
          isResizable: false,
          minW: conf?.minW,
          minH: conf?.minH ?? 2,
        }
      }
    )
  }, [dashboardData])

  useEffect(() => {
    document.title = dashboardData?.name ?? 'Dashboard Generator'
    return () => {
      document.title = 'Dashboard Generator'
    }
  }, [dashboardData?.name])

  const colors = useMemo(
    () => (colorThemes as any)[dashboardData?.conf?.dashboardTheme],
    [colorThemes, dashboardData?.conf?.dashboardTheme]
  )

  return (
    <>
      {isLoading ? (
        <DashboardPreviewLoader />
      ) : (
        <div
          className={
            /*  appContext.isMicrofrontend
              ? 'previewDashboard'
              :  */ 'previewDashboard overflowHide'
          }
        >
          <DashboardTitle />
          {dashboardFilters?.length > 0 ? (
            <div style={{ paddingLeft: '10px' }}>
              <Form
                form={form}
                onFinish={(values) => {
                  const formattedValues = Object.entries(values).map(
                    ([key, value]) => {
                      const [name, type, possible3rd] = key.split('_')
                      const isDateRange =
                        `${type}_${possible3rd}` === '$date_range'
                      const isRange = type === '$range'

                      const filterValue = [
                        isDateRange ? `${name}_$date_range` : `${name}_${type}`,
                        type === 'date' && !isDateRange
                          ? value
                            ? (value as moment.Moment)?.format('YYYY-MM-DD')
                            : defaultValueMapForFilters[name]
                          : isDateRange
                            ? value
                              ? (value as [moment.Moment, moment.Moment])
                                  .map((val) => val.format('YYYY-MM-DD'))
                                  .join('_')
                              : defaultValueMapForFilters[name]
                            : isRange
                              ? value
                                ? (value as [string, string]).join('_')
                                : defaultValueMapForFilters[name]
                              : value
                                ? value
                                : defaultValueMapForFilters[name],
                      ]
                      return filterValue
                    }
                  )
                  navigate({
                    search: queryString.stringify({
                      dashboard_filters: queryString.stringify(
                        Object.fromEntries(formattedValues)
                      ),
                    }),
                  })
                }}
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
                initialValues={dashboardFilterValuesFromUrl}
              >
                {dashboardFilters.map((filter) => {
                  const { id, name, defaultValue, type } = filter
                  return (
                    <div
                      key={id}
                      style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                      }}
                    >
                      <Form.Item
                        name={`${name}_$${type}`} // setting $ to the type, as naming convention, for not mixing with names, so type in code will be $range | $date | $date_range | $text
                        label={name}
                        style={{ marginBottom: 0 }}
                        initialValue={defaultValue}
                      >
                        {type === 'text' ? (
                          <Input placeholder="Enter a default value" />
                        ) : type === 'range' ? (
                          <Slider
                            range={{ draggableTrack: true }}
                            style={{ width: '300px', marginInline: 'auto' }}
                          />
                        ) : type === 'date' ? (
                          <DatePicker
                            style={{ width: '100%' }}
                            // allowClear={false}
                          />
                        ) : type === 'date_range' ? (
                          <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            // allowClear={false}
                            // onChange={(values) => {
                            //   if (!values) {
                            //     form.setFieldValue(name, defaultValue)
                            //   }
                            // }}
                          />
                        ) : null}
                      </Form.Item>
                    </div>
                  )
                })}
                <Button type="primary" htmlType="submit">
                  Apply
                </Button>
              </Form>
            </div>
          ) : null}
          <Dashboard
            colorTheme={colors}
            onLayoutChange={() => {}}
            dashboard={dashboardLayoutData}
          />
        </div>
      )}
    </>
  )
}

export function DashboardPreviewLoader() {
  return (
    <div className="previewDashboard">
      <Row align="middle" justify="space-between">
        <Col></Col>
      </Row>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Spin />
        <Typography.Text style={{ fontSize: '16px' }}>
          Loading Preview...
        </Typography.Text>
      </div>
    </div>
  )
}
