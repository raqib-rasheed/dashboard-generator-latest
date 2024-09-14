import { Button, Result } from 'antd'
import React from 'react'

const Page404: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button onClick={() => {}} type="primary">
        Back Home
      </Button>
    }
  />
)

export default Page404
