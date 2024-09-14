import { Typography, Divider, Space } from 'antd'
import { titleize } from 'inflection'
import {
  useWatch,
  type UseControllerProps,
  type Control,
  type UseFormResetField,
  type UseFormSetValue,
} from 'react-hook-form'

import {
  DatePicker,
  DateRangePicker,
  FieldWrapper,
  FieldWrapperPassThroughProps,
  Input,
  RangeSlider,
  Select,
} from '~/refactored/components/Form'
import { WIDGET_FILTER_TYPE_OPTIONS } from '~/refactored/const'
import { useWidgetStore } from '~/refactored/stores/create-widget'

import { WidgetFilter, Widget } from '../../../types'

type Props = {
  variable: WidgetFilter
  idx: number
  variables: WidgetFilter[]
  formMethods: FormMethods
}

export const Variable = ({ variable, variables, idx, formMethods }: Props) => {
  const isWidgetFormUpdated = useWidgetStore('isWidgetFormUpdated')
  const visualisationData = useWidgetStore('data')
  const setIsWidgetFormUpdated = useWidgetStore('setIsWidgetFormUpdated')
  const setVisualisationDetails = useWidgetStore('setVisualisationDetails')

  const { control, resetField, setValue } = formMethods
  const { widgetFilters } = useWatch({ control })
  const type = widgetFilters?.[idx]?.type ?? 'text'
  const { fieldToBeMapped, variableName } = variable

  const resetWidgetFormStatus = () => {
    if (!isWidgetFormUpdated) {
      setIsWidgetFormUpdated(true)
    }
    if (visualisationData?.length) {
      setVisualisationDetails({ data: [] })
    }
  }

  const defaultValueProps: UseControllerProps<Widget> &
    FieldWrapperPassThroughProps = {
    control,
    name: `widgetFilters.${idx}.defaultValue`,
    label: 'Default Value',
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <FieldWrapper label="Variable Name">
          <Typography.Text
            style={{
              color: '#1890ff',
              fontSize: 'medium',
              fontWeight: 500,
            }}
          >
            {variableName}
          </Typography.Text>
        </FieldWrapper>
        <FieldWrapper label="Field to be mapped">
          <Typography.Text style={{ fontSize: 'medium' }}>
            {fieldToBeMapped}
          </Typography.Text>
        </FieldWrapper>
        <Select
          control={control}
          name={`widgetFilters.${idx}.type`}
          label="Variable Type"
          placeholder="Variable Type"
          options={WIDGET_FILTER_TYPE_OPTIONS.map((option) => ({
            value: option,
            label: titleize(option),
          }))}
          onChange={(changedType: typeof type) => {
            resetField(`widgetFilters.${idx}.defaultValue`)
            setValue(
              `widgetFilters.${idx}.defaultValue`,
              changedType === 'range' ? ([0, 10] as any) : undefined
            )
            resetWidgetFormStatus()
          }}
        />
        {type === 'date' ? (
          <DatePicker
            placeholder="YYYY-MM-DD"
            onChange={resetWidgetFormStatus}
            {...defaultValueProps}
          />
        ) : type === 'text' ? (
          <Input
            placeholder="Enter a default value"
            onChange={resetWidgetFormStatus}
            {...defaultValueProps}
          />
        ) : type === 'date_range' ? (
          <DateRangePicker
            onChange={resetWidgetFormStatus}
            {...defaultValueProps}
          />
        ) : type === 'range' ? (
          <RangeSlider
            onChange={resetWidgetFormStatus}
            {...defaultValueProps}
            style={{ marginInline: '15px' }}
          />
        ) : null}
      </Space>
      {idx !== variables.length - 1 ? (
        <Divider style={{ marginBlock: '30px' }} />
      ) : null}
    </div>
  )
}

type FormMethods = {
  control: Control<Widget>
  resetField: UseFormResetField<Widget>
  setValue: UseFormSetValue<Widget>
}
