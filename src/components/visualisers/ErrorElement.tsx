import { CSSProperties } from 'react'

type Props = { error: any; styles: CSSProperties }

export const ErrorElement = ({ error, styles }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...styles,
      }}
    >
      <p style={{ color: 'hsla(0, 0%, 50%, 0.8)' }}>
        Error occured when fetching data!
      </p>
      <p>{error}</p>
    </div>
  )
}
