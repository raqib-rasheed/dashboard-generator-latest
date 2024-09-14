import * as React from 'react'
import { FieldError } from 'react-hook-form'

type FieldWrapperProps = {
  label: string
  alignment?: 'vertical' | 'horizontal'
  name?: string
  className?: string
  children: React.ReactNode
  error?: FieldError | undefined
  wrapperStyle?: React.CSSProperties | undefined
}

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  'className' | 'children'
>

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, name, error, children, alignment, wrapperStyle } = props
  const alignmentStyle =
    alignment === 'horizontal'
      ? { display: 'flex', alignItems: 'center', gap: '10px' }
      : {}

  return (
    <label htmlFor={name} style={{ ...wrapperStyle, ...alignmentStyle }}>
      {label ? <div style={{ marginBottom: '8px' }}>{label}</div> : null}
      <span style={{ flex: 'auto' }}>
        <div
          style={
            Array.isArray(children)
              ? { display: 'flex', alignItems: 'center' }
              : {}
          }
        >
          {children}
        </div>
        {error?.message && (
          <div
            role="alert"
            aria-label={error.message}
            style={{ fontSize: '14px', fontWeight: '500', color: 'red' }}
          >
            {error.message}
          </div>
        )}
      </span>
    </label>
  )
}
