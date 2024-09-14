import { Button, Result } from 'antd'

export const ErrorFallback = () => {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      role="alert"
    >
      <Result
        status="500"
        title="Something unwanted just happened!"
        subTitle="Please report this issue to the dev team along with the reproduction steps!"
        extra={
          <Button
            type="primary"
            onClick={() => window.location.assign(window.location.origin)}
          >
            Back Home
          </Button>
        }
      />
    </div>
  )
}
