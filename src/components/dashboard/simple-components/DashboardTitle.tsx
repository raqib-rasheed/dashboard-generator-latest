// import { AppContext } from '../../..'
import { Col, Row, Typography } from 'antd'
import capitalize from 'lodash/capitalize'

type tProps = {
  title?: string
}
export default function DashboardTitle({ title }: tProps) {
  // const appContext = useContext(AppContext)

  // if (appContext.isMicrofrontend) {
  //   return (
  //     <Row align="middle" justify="space-between">
  //       <Col>
  //         <Typography.Title level={3}>
  //           {capitalize(title ?? 'Dashboard Preview')}
  //         </Typography.Title>
  //       </Col>
  //       <Col>{/* <DashBoardFilters /> */}</Col>
  //     </Row>
  //   )
  // }

  return (
    <Row className="DashTitleBg" align="middle" justify="space-between">
      <Col>
        <Typography.Title className="DashTitle" level={3}>
          {capitalize(title ?? 'Dashboard Preview')}
        </Typography.Title>
      </Col>
      <Col>{/* <DashBoardFilters /> */}</Col>
    </Row>
  )
}
