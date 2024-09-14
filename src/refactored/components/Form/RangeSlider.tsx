import { Slider } from 'antd'
import type { SliderRangeProps } from 'antd/lib/slider'
import {
  useController,
  type UseControllerProps,
  type FieldValues,
} from 'react-hook-form'

import { FieldWrapper, type FieldWrapperPassThroughProps } from './FieldWrapper'

export type RangeSliderProps<T extends FieldValues> = UseControllerProps<T> &
  FieldWrapperPassThroughProps &
  Omit<SliderRangeProps, 'value' | 'defaultValue' | 'range'>

export function RangeSlider<T extends FieldValues>({
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
}: RangeSliderProps<T>) {
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
      <Slider
        range={{ draggableTrack: true }}
        id={name}
        value={value}
        onChange={(val: [number, number]) => {
          fieldOnChange(val as any) // TODO: Please fix this any
          onChange?.(val)
        }}
        defaultValue={!value ? [0, 10] : undefined}
        style={{ width: '100%', marginInline: 0 }}
        {...field}
        {...props}
      />
    </FieldWrapper>
  )
}
