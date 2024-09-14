import { Divider, Typography } from 'antd'
import { TitleProps } from 'antd/es/typography/Title'

type Props = {
  title: string
  titleLevel?: TitleProps['level']
  extra?: React.ReactNode
  style?: React.CSSProperties
}

const PageHeader = ({ title, titleLevel, extra, style }: Props) => {
  return (
    <div
      style={{
        width: '100%',
        ...(style ?? {}),
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '32px',
        }}
      >
        <Typography.Title level={titleLevel ?? 3} style={{ marginBlock: 0 }}>
          {title}
        </Typography.Title>
        {extra}
      </div>
      <Divider style={{ marginTop: 10 }} />
    </div>
  )
}

export default PageHeader
