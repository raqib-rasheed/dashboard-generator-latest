import { HolderOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import './styles.scss'

export const DragHandleButton = () => {
  return (
    <Button
      className="DragHandle"
      icon={<HolderOutlined style={{ fontSize: '20px' }} />}
    />
  )
}
