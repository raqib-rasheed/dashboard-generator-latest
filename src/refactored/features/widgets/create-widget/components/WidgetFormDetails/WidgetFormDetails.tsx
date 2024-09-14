import { zodResolver } from '@hookform/resolvers/zod'
import { Row, Col, message } from 'antd'
import * as React from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'

import { useWidgetStore } from '~/refactored/stores/create-widget'
import { convertObjectKeysToSnakeCase } from '~/refactored/utils/convertObjectKeysToSnakeCase'

import { useVisualiseWidget, useCreateWidget } from '../../api'
import { Widget, WidgetSchema } from '../../types'
import {
  doesWidgetContainAxisValueDetails,
  getConf,
  getFormSubmissionState,
  getWidgetValues,
} from '../../utils'

import {
  MainWidgetForm,
  VariableFormSection,
  Variable,
  WidgetButton,
} from './components'

export const WidgetFormDetails = () => {
  const confForFieldData = useWidgetStore('conf')
  const isVisualisationErrored = useWidgetStore('isVisualisationErrored')
  const setIsWidgetFormUpdated = useWidgetStore('setIsWidgetFormUpdated')

  const { control, handleSubmit, watch, resetField, getValues, setValue } =
    useForm<Widget>({
      resolver: zodResolver(WidgetSchema),
      defaultValues: {
        visualisationType: 'table',
        widgetFilters: [],
      },
    })

  const { fields: sqlVariables, replace } = useFieldArray({
    control,
    name: 'widgetFilters',
  })
  const { visualisationType, xAxis, yAxis } = getWidgetValues({
    getValues,
    watch,
  })

  const [buttonType, setButtonType] = React.useState<WidgetButton>(
    'visualisationButton'
  )

  const {
    isLoading: isVisualising,
    data: visualisationData,
    mutateAsync: tryVisualisingWidget,
    status: visualisationStatus,
  } = useVisualiseWidget()
  const {
    isLoading: isCreating,
    mutateAsync: tryCreatingWidget,
    status: creationStatus,
  } = useCreateWidget()

  const conf = getConf({
    confForFieldData,
    visualisationData,
  })

  const submissionState = getFormSubmissionState({
    creationStatus,
    isCreating,
    isVisualising,
    visualisationStatus,
  })

  const containsAxisDetails =
    doesWidgetContainAxisValueDetails(visualisationType)

  const handleVisualisationFailedError = () => {
    message.destroy('sqlError')
    message.error({
      content: 'Please update your SQL query!',
      key: 'sqlError',
    })
  }

  const onSubmit: SubmitHandler<Widget> = async (data) => {
    if (isVisualisationErrored) {
      return handleVisualisationFailedError()
    }
    const visualisationTypeKey = `${visualisationType}_conf` as const
    const confSetting = {
      [visualisationTypeKey]: conf,
    }
    const axisDetails = xAxis && yAxis ? { x_axis: xAxis, y_axis: yAxis } : {}
    const widgetWithConf = {
      ...convertObjectKeysToSnakeCase(data),
      conf: {
        ...confSetting,
        ...axisDetails,
      },
    }
    if (buttonType === 'createButton') {
      await tryCreatingWidget(widgetWithConf)
    } else if (buttonType === 'visualisationButton') {
      tryVisualisingWidget(widgetWithConf).catch((e) => console.log(e))
    }
    setIsWidgetFormUpdated(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ height: containsAxisDetails ? '675px' : '625px' }}
    >
      <Row gutter={[12, 12]} style={{ height: '100%' }}>
        <Col span={sqlVariables.length > 0 ? 16 : 24}>
          <MainWidgetForm
            formMethods={{ control, resetField, replace }}
            isVisualisationSuccessful={visualisationStatus === 'success'}
            setButtonType={setButtonType}
            submissionState={submissionState}
          />
        </Col>
        {sqlVariables.length > 0 && (
          <Col span={8} style={{ height: '100%' }}>
            <VariableFormSection>
              {sqlVariables.map((variable, idx) => (
                <Variable
                  formMethods={{ control, resetField, setValue }}
                  variable={variable}
                  variables={sqlVariables}
                  idx={idx}
                  key={variable.variableName} // rhf docs suggest to use id produced by the library, but here since variableName is unique, hence we are using it and for solving new set of filter field item onChange of sql input, since we are using replace utility
                />
              ))}
            </VariableFormSection>
          </Col>
        )}
      </Row>
    </form>
  )
}
