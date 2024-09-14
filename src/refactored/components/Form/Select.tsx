import { Select as $Select, type SelectProps as $SelectProps } from 'antd'
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from 'react-hook-form'

import { FieldWrapper, type FieldWrapperPassThroughProps } from './FieldWrapper'

export type SelectProps<T extends FieldValues> = UseControllerProps<T> &
  FieldWrapperPassThroughProps &
  Omit<$SelectProps, 'value' | 'defaultValue'> & { extra?: React.ReactNode }

export function Select<T extends FieldValues>({
  name,
  label,
  wrapperStyle,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  onChange,
  alignment,
  extra,
  ...props
}: SelectProps<T>) {
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

  return (
    <FieldWrapper
      label={label}
      error={fieldState?.error}
      alignment={alignment}
      name={field.name}
      wrapperStyle={wrapperStyle}
    >
      <$Select
        id={name}
        value={value}
        onChange={(val, option) => {
          fieldOnChange(val)
          onChange?.(val, option)
        }}
        status={fieldState?.error ? 'error' : undefined}
        {...field}
        {...props}
        style={{ width: '100%', ...props.style }}
      />
      {extra}
    </FieldWrapper>
  )
}
