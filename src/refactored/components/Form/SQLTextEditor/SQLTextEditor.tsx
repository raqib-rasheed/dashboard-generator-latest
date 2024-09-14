import * as React from 'react'
import AceEditor, { IAceEditorProps } from 'react-ace'
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'
import './styles.scss'

import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from '../FieldWrapper'

type SQLTextEditorProps<T extends FieldValues> = UseControllerProps<T> &
  FieldWrapperPassThroughProps &
  Omit<IAceEditorProps, 'value' | 'defaultValue'>

export function SQLTextEditor<T extends FieldValues>({
  name,
  label,
  wrapperStyle,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  alignment,
  onChange,
  ...props
}: SQLTextEditorProps<T>) {
  const [shouldFocus, setShouldFocus] = React.useState(false)
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
      <AceEditor
        highlightActiveLine={false}
        style={{
          width: '100% !important',
          border: fieldState?.error ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
          height: '250px',
        }}
        enableBasicAutocompletion
        enableLiveAutocompletion
        enableSnippets
        mode="mysql"
        theme="tomorrow"
        fontSize={16}
        className="sqlEditor"
        value={value}
        onChange={(val) => {
          fieldOnChange(val as any) // TODO: Check when using this component, if this really works
          onChange?.(val)
        }}
        {...field}
        ref={() => {
          field.ref({
            focus: () => setShouldFocus(true),
          })
        }}
        focus={shouldFocus}
        onBlur={() => {
          field.onBlur()
          setShouldFocus(false)
        }}
        {...props}
      />
    </FieldWrapper>
  )
}
