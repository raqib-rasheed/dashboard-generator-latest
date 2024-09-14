import { Card, Button, Row, Col } from 'antd'
import { isEmpty, startCase, toLower } from 'lodash'
import * as React from 'react'
import {
  Control,
  UseFieldArrayReplace,
  UseFormResetField,
  useWatch,
} from 'react-hook-form'
import { Link } from 'react-router-dom'

import PageHeader from '~/components/common/pageHeader'
import { Input, Select, SQLTextEditor } from '~/refactored/components/Form'
import { useGetConnections } from '~/refactored/features/connections'
import {
  useGenerateRedirectParam,
  useNavigateBackToRedirect,
} from '~/refactored/hooks'
import { useWidgetStore } from '~/refactored/stores/create-widget'

import { AVAILABLE_VIZ } from '../../../const'
import { Widget } from '../../../types'
import {
  extractVariables,
  getAxisValidations,
  getFormSubmissionState,
  getStatsDataAndValidation,
  removeDuplicateFromArray,
} from '../../../utils'

type Props = {
  formMethods: FormMethods
  isVisualisationSuccessful: boolean
  setButtonType: React.Dispatch<React.SetStateAction<WidgetButton>>
  submissionState: ReturnType<typeof getFormSubmissionState>
}

export const MainWidgetForm = ({
  formMethods,
  isVisualisationSuccessful,
  setButtonType,
  submissionState,
}: Props) => {
  const conf = useWidgetStore('conf')
  const visualisationData = useWidgetStore('data')
  const xAxis = useWidgetStore('x_axis')
  const yAxis = useWidgetStore('y_axis')
  const isWidgetFormUpdated = useWidgetStore('isWidgetFormUpdated')
  const isVisualisationErrored = useWidgetStore('isVisualisationErrored')
  const resetVisualisationStore = useWidgetStore('resetVisualisationStore')
  const setConfForFieldData = useWidgetStore('setConfForFieldData')
  const setVisualisationDetails = useWidgetStore('setVisualisationDetails')
  const setIsWidgetFormUpdated = useWidgetStore('setIsWidgetFormUpdated')

  const redirectTo = useGenerateRedirectParam()

  const visualisationDataExists = !isEmpty(visualisationData)
  const [yAxisOptions, setYAxisOptions] = React.useState<string[]>([])

  React.useEffect(() => {
    if (submissionState === 'success') {
      setIsWidgetFormUpdated(false)
    }
  }, [setIsWidgetFormUpdated, submissionState])

  const { control, replace, resetField } = formMethods
  const { visualisationType } = useWatch({ control })

  const { data: connections, isLoading: isConnectionsLoading } =
    useGetConnections()
  const navigateBackToRedirect = useNavigateBackToRedirect()

  const {
    isXFieldValid,
    isYFieldValid,
    areAllYfieldsAValidNumber,
    containsAxisDetails,
  } = getAxisValidations({
    visualisationData,
    visualisationType,
    conf,
    xAxis,
    yAxis,
  })

  const areAllXAndYFieldsValid =
    isXFieldValid && isYFieldValid && areAllYfieldsAValidNumber

  const isVisualizingStats = visualisationType === 'statistics'
  const { isStatsVisualizationPossible } = getStatsDataAndValidation({
    visualisationData,
  })

  const canSaveButtonBeShown =
    isVisualisationSuccessful &&
    visualisationDataExists &&
    (containsAxisDetails ? areAllXAndYFieldsValid : true) &&
    (isVisualizingStats ? isStatsVisualizationPossible : true) &&
    !isWidgetFormUpdated &&
    !isVisualisationErrored

  const resetSomeStoreValues = () => {
    if (!isWidgetFormUpdated) {
      setIsWidgetFormUpdated(true)
    }
    if (visualisationData?.length) {
      setVisualisationDetails({ data: [] })
    }
  }

  const handleCancelClick = () => {
    navigateBackToRedirect()
    resetVisualisationStore()
  }

  return (
    <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }}>
      <PageHeader
        titleLevel={4}
        title="Add Widget"
        extra={
          canSaveButtonBeShown ? (
            <Button
              disabled={submissionState === 'creating'}
              loading={submissionState === 'creating'}
              onClick={() => {
                setButtonType('createButton')
              }}
              htmlType="submit"
              type="primary"
              className="btn-bg-success"
            >
              Save Widget
            </Button>
          ) : null
        }
      />
      <Row gutter={[24, 12]}>
        <Col span={12} style={{ minWidth: '300px' }}>
          <Input
            control={control}
            label="Widget name"
            name="name"
            placeholder="Widget name"
          />
        </Col>
        <Col span={12} style={{ minWidth: '300px' }}>
          <Input
            control={control}
            label="Title to be displayed"
            name="title"
            placeholder="Title"
            onChange={resetSomeStoreValues}
          />
        </Col>
        <Col span={12} style={{ minWidth: '300px' }}>
          <Select
            wrapperStyle={{ flex: 'auto' }}
            control={control}
            label="Connection"
            name="connection"
            placeholder="Connection"
            loading={isConnectionsLoading}
            options={(connections ?? [])?.map((item) => ({
              value: item?.id,
              label: item?.name,
            }))}
            onChange={resetSomeStoreValues}
            extra={
              <Link
                to={{
                  pathname: '/upsert-connection',
                  search: redirectTo,
                }}
                onClick={resetVisualisationStore}
              >
                <Button type="primary" className="ml-5" ghost>
                  Add Connection
                </Button>
              </Link>
            }
          />
        </Col>
        <Col span={12} style={{ minWidth: '300px' }}>
          <Select
            control={control}
            name="visualisationType"
            label="Visualization"
            placeholder="Visualisation Type"
            onChange={(type) => {
              resetSomeStoreValues()
              setConfForFieldData({})
              setVisualisationDetails({ type })
              resetField('xAxis')
              resetField('yAxis')
            }}
            options={AVAILABLE_VIZ.map((item) => ({
              value: item,
              label: startCase(toLower(item)),
            }))}
          />
        </Col>
        <Col span={24}>
          <SQLTextEditor
            control={control}
            label="Query"
            name="sql"
            onChange={(value) => {
              resetSomeStoreValues()
              if (value) {
                const newWidgetFilters = extractVariables(value)
                const uniqueWidgetFilters = removeDuplicateFromArray(
                  newWidgetFilters,
                  'variableName'
                )
                replace(uniqueWidgetFilters)
              } else {
                replace([])
              }
            }}
          />
        </Col>
      </Row>
      {containsAxisDetails ? (
        <Row gutter={12} style={{ marginTop: '12px' }}>
          <Col span={12}>
            <Input
              control={control}
              name="xAxis"
              placeholder="Eg: Date"
              onChange={resetSomeStoreValues}
              label={
                visualisationType === 'donut_chart' ||
                visualisationType === 'pie_chart'
                  ? 'Label Field'
                  : 'X Axis'
              }
            />
          </Col>
          <Col span={12}>
            {visualisationType === 'line_chart' ||
            visualisationType === 'bar_chart' ? (
              <Select
                control={control}
                name="yAxis"
                label="Y Axis"
                mode="multiple"
                options={yAxisOptions.map((op) => ({
                  label: op,
                  value: op,
                }))}
                placeholder="Type the option to be set as Y axis and press {{Enter}}."
                onChange={resetSomeStoreValues}
                onSearch={(value) => {
                  if (value.trim()) {
                    setYAxisOptions([value])
                  } else if (!value) {
                    setYAxisOptions([])
                  }
                }}
                onInputKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setYAxisOptions([])
                  }
                }}
                dropdownStyle={{ display: 'none' }}
              />
            ) : (
              <Input
                control={control}
                name="yAxis"
                label="Value Field"
                placeholder="Eg: Price"
                onChange={resetSomeStoreValues}
              />
            )}
          </Col>
        </Row>
      ) : null}
      <Row justify="end" gutter={12} style={{ marginTop: '24px' }}>
        <Col>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </Col>
        <Col>
          <Button
            htmlType="submit"
            type="primary"
            style={{ minWidth: '100px' }}
            loading={submissionState === 'visualising'}
            disabled={submissionState === 'visualising'}
            onClick={() => {
              setButtonType('visualisationButton')
            }}
          >
            {submissionState === 'visualising' ? 'Executing...' : 'Execute'}
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export type WidgetButton = 'visualisationButton' | 'createButton'

type FormMethods = {
  control: Control<Widget>
  resetField: UseFormResetField<Widget>
  replace: UseFieldArrayReplace<Widget>
}
