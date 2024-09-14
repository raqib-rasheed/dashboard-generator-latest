import { CloseOutlined, SettingOutlined } from '@ant-design/icons'
import { Card, Button, Row, Col, Empty, Result } from 'antd'
import { humanize } from 'inflection'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import PageHeader from '~/components/common/pageHeader'
import BarChart from '~/components/visualisers/bar-charts/BarChart'
import DonutChart from '~/components/visualisers/donut-chart/DonutChart'
import LineChart from '~/components/visualisers/line-chart/LineChart'
import PieChart from '~/components/visualisers/pie-chart/PieChart'
import Statistic from '~/components/visualisers/statitics/Statitics'
import ReactTable from '~/components/visualisers/table/ReactTable'
import { useWidgetStore } from '~/refactored/stores/create-widget'
import { checkIfXYFieldsAreValid } from '~/utils/checkIfXYFieldsAreValid'

import { useScrollIntoViewWhenRendered } from '../../hooks'
import { VisualisationType } from '../../types'
import {
  doesWidgetContainAxisValueDetails,
  getStatsDataAndValidation,
} from '../../utils'

import { ConfigureWidget } from './ConfigureWidget'

export const VisualiseWidget = () => {
  const visualisationData = useWidgetStore('data')
  const visualisationType = useWidgetStore('type')
  const conf = useWidgetStore('conf')
  const xAxis = useWidgetStore('x_axis')
  const yAxis = useWidgetStore('y_axis')
  const title = useWidgetStore('title')
  const isVisualisationErrored = useWidgetStore('isVisualisationErrored')
  const setVisualisationDetails = useWidgetStore('setVisualisationDetails')

  const [isConfigureCardVisible, setIsConfigureCardVisible] =
    React.useState(false)

  const visualisationSectionBottomRef =
    useScrollIntoViewWhenRendered<HTMLDivElement>()

  const componentMap: Readonly<
    Record<VisualisationType, React.FunctionComponent<any>>
  > = {
    statistics: Statistic,
    line_chart: LineChart,
    table: ReactTable,
    donut_chart: DonutChart,
    bar_chart: BarChart,
    // radial_chart: RadialChart,
    // column_chart: ColumnChart,
    pie_chart: PieChart,
  }

  const VisualisationComponent = componentMap[visualisationType ?? 'table']

  const isDataNotEmpty = visualisationData != null || visualisationData !== ''

  const { isXFieldValid, isYFieldValid } = checkIfXYFieldsAreValid({
    data: visualisationData,
    xField: xAxis,
    yField: yAxis,
  })

  const containsAxisDetails = doesWidgetContainAxisValueDetails(
    visualisationType!
  )

  const isVisualizingStats = visualisationType === 'statistics'
  const { isStatsVisualizationPossible } = getStatsDataAndValidation({
    visualisationData,
  })

  const canConfigureButtonBeShown =
    !isConfigureCardVisible &&
    isDataNotEmpty &&
    (containsAxisDetails ? isXFieldValid && isYFieldValid : true) &&
    (isVisualizingStats ? isStatsVisualizationPossible : true) &&
    !isVisualisationErrored &&
    // TODO: for now only enabling Configure button for Table and Statistics (for any widget that doesn't have axis details)
    !containsAxisDetails

  return (
    <Row
      style={{
        minHeight: isDataNotEmpty ? '500px' : '300px',
      }}
      gutter={[12, 12]}
      className="mt-12"
    >
      <Col span={isConfigureCardVisible ? 16 : 24}>
        <Card style={{ height: '100%', flex: 1 }}>
          <PageHeader
            titleLevel={4}
            title="Visualization"
            extra={
              canConfigureButtonBeShown ? (
                <Button
                  onClick={() => {
                    setIsConfigureCardVisible(true)
                  }}
                  icon={<SettingOutlined />}
                  type="primary"
                  ghost
                >
                  Configure
                </Button>
              ) : undefined
            }
          />
          {isDataNotEmpty ? (
            <ErrorBoundary
              FallbackComponent={VisualiseWidgetErrorFallback}
              onError={() => {
                setVisualisationDetails({ isVisualisationErrored: true })
              }}
            >
              <VisualisationComponent
                xField={xAxis}
                yField={yAxis}
                data={visualisationData}
                title={title}
                conf={conf}
              />
            </ErrorBoundary>
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
      {isConfigureCardVisible ? (
        <Col span={8}>
          <Card style={{ height: '100%' }}>
            <PageHeader
              titleLevel={4}
              title={`Configure ${humanize(visualisationType!)}`}
              extra={
                <CloseOutlined
                  style={{ fontSize: '16px' }}
                  onClick={() => {
                    setIsConfigureCardVisible(false)
                  }}
                />
              }
            />
            <ConfigureWidget />
          </Card>
        </Col>
      ) : null}
      <div ref={visualisationSectionBottomRef} />
    </Row>
  )
}

function VisualiseWidgetErrorFallback({
  error,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  const message = error.message
    .toLocaleLowerCase()
    .includes('objects are not valid as a react child')
    ? `One of your columns in the specified SQL query is an object (i.e contains multiple
        properties) and is not a Primitive value (i.e a String, Number, Boolean and more).
        This widget only supports columns with primitive values, so please try again with a different query.`
    : 'Oops! There was an error visualizing the widget. Please validate if your SQL query is correct and re-run the visualization. Otherwise report this error to the dev team.'

  return (
    <Result status="error" title="Visualization failed" subTitle={message} />
  )
}
