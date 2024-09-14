import { Input as $Input, type InputProps as $InputProps } from 'antd'
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form'

import { FieldWrapper, type FieldWrapperPassThroughProps } from './FieldWrapper'

export type InputProps<T extends FieldValues> = UseControllerProps<T> &
  FieldWrapperPassThroughProps &
  Omit<$InputProps, 'value' | 'defaultValue'>

export function Input<T extends FieldValues>({
  name,
  label,
  wrapperStyle,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  alignment,
  onChange,
  type,
  ...props
}: InputProps<T>) {
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
      {type === 'password' ? (
        <$Input.Password
          id={name}
          status={fieldState?.error ? 'error' : undefined}
          value={value}
          onChange={(val) => {
            fieldOnChange(val)
            onChange?.(val)
          }}
          {...field}
          {...props}
        />
      ) : (
        <$Input
          id={name}
          status={fieldState?.error ? 'error' : undefined}
          value={value}
          onChange={(val) => {
            fieldOnChange(val)
            onChange?.(val)
          }}
          {...field}
          {...props}
        />
      )}
    </FieldWrapper>
  )
}
