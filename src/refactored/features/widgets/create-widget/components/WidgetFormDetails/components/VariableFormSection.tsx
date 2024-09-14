import { Card } from 'antd'

import PageHeader from '~/components/common/pageHeader'

type Props = { children: React.ReactNode }

export const VariableFormSection = ({ children }: Props) => {
  return (
    <Card
      style={{ height: '100%' }}
      bodyStyle={{ height: 'calc(100% - 80px)' }}
    >
      <PageHeader titleLevel={4} title="Variables" />
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          paddingRight: '5px',
        }}
        className="scrollableContainer"
      >
        {children}
      </div>
    </Card>
  )
}
