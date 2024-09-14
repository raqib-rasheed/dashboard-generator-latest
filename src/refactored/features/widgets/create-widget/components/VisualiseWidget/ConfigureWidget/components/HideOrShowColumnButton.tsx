import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'

export function HideOrShowColumnButton({
  id,
  isVisible,
  passFormValuesToParent,
  initialFormValues,
}: {
  id: string
  isVisible: boolean
  passFormValuesToParent: (formValues: any) => void
  initialFormValues: any
}) {
  const [visible, setVisible] = useState(isVisible)

  function handleEyeButtonClick() {
    setVisible((prev) => !prev)
    passFormValuesToParent({
      ...initialFormValues,
      [id]: {
        ...initialFormValues[id],
        isVisible: !initialFormValues[id]['isVisible'],
      },
    })
  }

  return <EyeButton visible={visible} onClick={handleEyeButtonClick} />
}

type EyeButtonProps = {
  visible: boolean
  onClick: () => void
}
function EyeButton({ visible, onClick }: EyeButtonProps) {
  return (
    <Button
      type="text"
      onClick={onClick}
      icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
    />
  )
}
