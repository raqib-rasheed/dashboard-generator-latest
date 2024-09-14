import { Card } from 'antd'

import PageHeader from '~/components/common/pageHeader'

import { CreateConnectionForm } from '../components/CreateConnectionForm'

export const CreateConnection = () => {
  return (
    <Card style={{ maxWidth: '650px', margin: 'auto' }}>
      <PageHeader title="Add Connection" titleLevel={4} />
      <CreateConnectionForm />
    </Card>
  )
}
