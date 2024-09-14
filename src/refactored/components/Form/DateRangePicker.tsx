import { DatePicker } from 'antd'
import type { RangePickerProps } from 'antd/lib/date-picker'
import dayjs from 'dayjs'
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from 'react-hook-form'

import { FieldWrapper, type FieldWrapperPassThroughProps } from './FieldWrapper'

const $DateRangePicker = DatePicker.RangePicker

export type DateRangePickerProps<T extends FieldValues> =
  UseControllerProps<T> &
    FieldWrapperPassThroughProps &
    Omit<RangePickerProps, 'value' | 'defaultValue'>

export function DateRangePicker<T extends FieldValues>({
  name,
  label,
  wrapperStyle,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  onChange,
  alignment,
  ...props
}: DateRangePickerProps<T>) {
  const {
    field: { value, onChange: fieldOnChange, ...field },
    fieldState,
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
  })

  const dateRangeValueRequiredByAntd =
    value?.[0] && value?.[1] ? [dayjs(value[0]), dayjs(value[1])] : undefined

  return (
    <FieldWrapper
      label={label}
      error={fieldState?.error}
      alignment={alignment}
      name={field.name}
      wrapperStyle={wrapperStyle}
    >
      <$DateRangePicker
        id={name}
        value={dateRangeValueRequiredByAntd as any}
        format="YYYY-MM-DD"
        onChange={(val, option) => {
          fieldOnChange(
            val?.[0] && val?.[1]
              ? ([
                  (val[0] as dayjs.Dayjs).toDate(),
                  (val[1] as dayjs.Dayjs).toDate(),
                ] as any)
              : undefined
          )
          onChange?.(val, option)
        }}
        status={fieldState?.error ? 'error' : undefined}
        style={{ width: '100%' }}
        placeholder={['Start Date', 'End Date']}
        {...field}
        {...props}
      />
    </FieldWrapper>
  )
}
