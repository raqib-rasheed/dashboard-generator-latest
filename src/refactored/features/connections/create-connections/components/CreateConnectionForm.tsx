import { zodResolver } from '@hookform/resolvers/zod'
import { Row, Col, Button } from 'antd'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Input } from '~/refactored/components/Form'

import { useCreateConnection } from '../api'
import { Connection } from '../types'
import { transformForBackend } from '../utils'

export const CreateConnectionForm = () => {
  const { control, handleSubmit } = useForm<Connection>({
    resolver: zodResolver(Connection),
  })

  const { isLoading, mutate: createConnection } = useCreateConnection()

  const submitCreateConnectionForm: SubmitHandler<Connection> = (data) => {
    const payload = transformForBackend(data)
    createConnection(payload)
  }

  return (
    <form
      onSubmit={handleSubmit(submitCreateConnectionForm)}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <Input
        label="Connection name"
        control={control}
        name="name"
        placeholder="My Connection"
      />
      <Input
        label="Host"
        control={control}
        name="hostUrl"
        placeholder="https://"
      />
      <Input
        label="Port"
        control={control}
        name="portNumber"
        placeholder="5173?"
      />
      <Input
        label="Username"
        control={control}
        name="username"
        placeholder="awesome_user"
      />
      <Input
        type="password"
        label="Password"
        control={control}
        name="password"
        placeholder="ssshhhhh! ****"
      />
      <Input
        label="Database Name"
        control={control}
        name="databaseName"
        placeholder="pguser?"
      />
      <Row justify="end" style={{ marginTop: '12px' }}>
        <Col>
          <Button
            htmlType="submit"
            type="primary"
            style={{ minWidth: '100px' }}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Col>
      </Row>
    </form>
  )
}
