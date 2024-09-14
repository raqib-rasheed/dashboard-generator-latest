import { MoreOutlined, CloseOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { humanize } from 'inflection'
import { startCase } from 'lodash'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Input, Select } from '~/refactored/components/Form'

import { DATE_FORMATS } from '../../../../const'
import { ConfForAnyField } from '../../../../types'

type Props = {
  conf: ConfForAnyField | undefined
  id: string
  passFormValuesToParent: (formValues: any) => void
  initialFormValues: any
}

export const KeyConfigurationPopoverForm = ({
  id,
  conf,
  passFormValuesToParent,
  initialFormValues,
}: Props) => {
  const [open, setOpen] = React.useState(false)
  const { control, getValues } = useForm<ConfForAnyField>({
    defaultValues: initialFormValues[id],
  })

  function pushFormValuesToParent() {
    passFormValuesToParent({
      ...initialFormValues,
      [id]: { ...initialFormValues[id], ...getValues() },
    })
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (newOpen === false) {
      pushFormValuesToParent()
    }
  }

  const configForm = (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {Object.keys(conf ?? {})
        .filter(
          (setting) =>
            setting !== 'id' &&
            setting !== 'isVisible' &&
            setting !== 'order' &&
            setting !== 'chosen' &&
            setting !== 'selected'
        )
        .map((setting) => (
          <React.Fragment key={setting}>
            {id.includes('time') && setting === 'format' ? (
              <Select
                control={control}
                name={setting as keyof typeof conf}
                label={startCase(humanize(setting))}
                options={DATE_FORMATS.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            ) : (
              <Input
                control={control}
                name={setting as keyof typeof conf}
                label={startCase(humanize(setting))}
                disabled={setting === 'display_as' || setting === 'data_type'}
              />
            )}
          </React.Fragment>
        ))}
    </form>
  )

  const titleContent = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBlock: '8px',
      }}
    >
      <span>{`${startCase(humanize(id))} Configuration`}</span>
      <CloseOutlined
        onClick={() => {
          setOpen(false)
          pushFormValuesToParent()
        }}
      />
    </div>
  )

  return (
    <Popover
      destroyTooltipOnHide
      content={configForm}
      title={titleContent}
      open={open}
      placement="left"
      arrowPointAtCenter
      showArrow={false}
      trigger="click"
      onOpenChange={handleOpenChange}
    >
      <MoreOutlined />
    </Popover>
  )
}
