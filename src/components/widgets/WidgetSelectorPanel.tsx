import { PlusOutlined } from '@ant-design/icons'
import { Card, Layout, Tooltip } from 'antd'
import _ from 'lodash'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { useGenerateRedirectParam } from '~/refactored/hooks'

import WidgetIcon from '../visualisers/helpers/GetWidgetIcons'

import './styles.scss'

interface IWidgetSelectorPanelProps {
  selectedConnection: number | undefined
  setWidgetsAddedToCanvas: React.Dispatch<React.SetStateAction<any[]>>
  connectionsList: any[]
}

export default function WidgetSelectorPanel(props: IWidgetSelectorPanelProps) {
  const redirectTo = useGenerateRedirectParam()

  function handleWidgetItemClick(itemToAdd: never) {
    props?.setWidgetsAddedToCanvas((prevValues) => [...prevValues, itemToAdd])
  }

  const widgets = React.useMemo(() => {
    return props?.selectedConnection
      ? props?.connectionsList?.find(
          (connection: any) => connection?.id === props?.selectedConnection
        )?.widgets
      : []
  }, [props?.connectionsList, props?.selectedConnection])

  return (
    <Layout.Sider
      theme="light"
      className="select-widgets-sider scrollableContainer"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
          height: 'auto',
          flexWrap: 'wrap',
          margin: '5px',
        }}
      >
        <Card className="createNewButton">
          <Link
            to={{
              pathname: '/upsert-widget',
              search: redirectTo,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <PlusOutlined />
              <br />
              Add New
            </div>
          </Link>
        </Card>
        {widgets?.map((item: any, index: number) => (
          <div key={item?.id ?? index} className="m-5 cursor-pointer">
            <Card
              onClick={() => handleWidgetItemClick(item as never)}
              className="widgetsCard"
            >
              <div style={{ textAlign: 'center' }}>
                <WidgetIcon type={item?.visualisation_type} />
                <br />
                <Tooltip title={_.capitalize(item?.name)}>
                  {_.truncate(_.capitalize(item?.name), { length: 15 })}
                </Tooltip>
              </div>
            </Card>
          </div>
        ))}
        <div className="mt-5 cursor-pointer">
          <Link
            to={
              props?.selectedConnection
                ? `/upsert-widget?connectionId=${props?.selectedConnection}`
                : `/upsert-widget`
            }
          ></Link>
        </div>
      </div>
    </Layout.Sider>
  )
}
