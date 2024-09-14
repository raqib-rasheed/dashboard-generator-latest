import {
  DatePicker as $DatePicker,
  DatePickerProps as $DatePickerProps,
} from 'antd'
import dayjs from 'dayjs'
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from 'react-hook-form'

import { FieldWrapper, type FieldWrapperPassThroughProps } from './FieldWrapper'

export type DatePickerProps<T extends FieldValues> = UseControllerProps<T> &
  FieldWrapperPassThroughProps &
  Omit<$DatePickerProps, 'value' | 'defaultValue'>

export function DatePicker<T extends FieldValues>({
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
}: DatePickerProps<T>) {
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

  const dateValueRequiredByAntd = value ? dayjs(value) : undefined

  return (
    <FieldWrapper
      label={label}
      error={fieldState?.error}
      alignment={alignment}
      name={field.name}
      wrapperStyle={wrapperStyle}
    >
      <$DatePicker
        id={name}
        value={dateValueRequiredByAntd as any}
        format="YYYY-MM-DD"
        onChange={(val, option) => {
          fieldOnChange(
            val ? ((val as dayjs.Dayjs).toDate() as any) : undefined
          )
          onChange?.(val, option)
        }}
        status={fieldState?.error ? 'error' : undefined}
        style={{ width: '100%' }}
        {...field}
        {...props}
      />
    </FieldWrapper>
  )
}
