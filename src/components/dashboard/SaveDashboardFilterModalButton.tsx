import { CloseOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Slider,
  Tooltip,
  Typography,
} from 'antd'
import { ButtonProps } from 'antd/es/button'
import { useForm, useWatch } from 'antd/lib/form/Form'
import { humanize } from 'inflection'
import { startCase } from 'lodash'
import * as React from 'react'

import { WIDGET_FILTER_TYPE_OPTIONS } from '~/refactored/const'
import { WidgetFilterType } from '~/refactored/features/widgets/create-widget/types'

type Props = {
  initialValues?: DashboardFilterFormValues
  dashboardData: any[]
  buttonText: string
  dashboardFilters: DashboardFilterFormValues[]
  currentFilter?: number
  onClick?: ButtonProps['onClick']
  setDashboardFilters: any
}

export type DashboardFilterFormValues = {
  filterName: string
  filterType: WidgetFilterType
  defaultValue: string | [string, string]
}

const SaveDashboardFilterModalButton = ({
  initialValues,
  dashboardData,
  buttonText,
  dashboardFilters,
  currentFilter,
  onClick,
  setDashboardFilters,
}: Props) => {
  const [modalState, setModalState] = React.useState<'open' | 'closed'>(
    'closed'
  )
  const isUpdateForm = Boolean(initialValues)
  const [form] = useForm<DashboardFilterFormValues>()
  const filterType = useWatch('filterType', form)

  const widgetsOnDashboard = dashboardData.map((dash) => ({
    id: dash?.question?.id,
    title: dash?.question?.title,
    widgetFilters: dash?.question?.widgetFilters,
  }))

  return (
    <div>
      <Button
        onClick={(e) => {
          setModalState('open')
          if (onClick) {
            onClick(e)
          }
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span>{buttonText}</span>
        {currentFilter != null ? (
          <Tooltip title="Remove Filter" placement="bottom">
            <CloseOutlined
              style={{ fontSize: '15px', paddingRight: 0, marginLeft: 0 }}
              onClick={() => {
                setDashboardFilters((prev: any) =>
                  prev.filter((_: any, idx: any) => idx !== currentFilter)
                )
              }}
            />
          </Tooltip>
        ) : null}
      </Button>
      <Modal
        open={modalState === 'open'}
        closable
        title={`${isUpdateForm ? 'Update' : 'Create'} Filter`}
        okText={isUpdateForm ? 'Update' : 'Create'}
        bodyStyle={{ paddingRight: 0 }}
        width="800px"
        onCancel={() => {
          setModalState('closed')
          form.resetFields()
        }}
        destroyOnClose
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              if (values.filterName.includes('_')) {
                return form.setFields([
                  {
                    name: 'filterName',
                    errors: [
                      'Filter name should not contain underscore (_) character. Please update the name!',
                    ],
                  },
                ])
              }
              const filterIndexWithSameName = dashboardFilters.findIndex(
                (filter) => filter.filterName === values.filterName
              )
              const filterWithSuchNameAlreadyExists = dashboardFilters.some(
                (filter) => filter.filterName === values.filterName
              )
              const theOneBeingEditedIsNotTheCurrent =
                filterIndexWithSameName !== currentFilter

              if (
                filterWithSuchNameAlreadyExists &&
                theOneBeingEditedIsNotTheCurrent
              ) {
                return form.setFields([
                  {
                    name: 'filterName',
                    errors: [
                      'Filter with such name already exists in this dashboard. Please choose a unique name!',
                    ],
                  },
                ])
              }

              setModalState('closed')
              if (isUpdateForm) {
                const newFilters = [...dashboardFilters]
                newFilters[currentFilter as number] = values
                setDashboardFilters(newFilters)
                return
              }
              form.resetFields()
              setDashboardFilters((prev: any) => [...prev, values])
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <Form
          layout="vertical"
          initialValues={initialValues ? initialValues : { filterType: 'text' }}
          validateTrigger="submit"
          form={form}
          className="scrollableContainer"
          style={{ maxHeight: '400px', overflow: 'auto', paddingRight: '24px' }}
        >
          <Form.Item
            label="Filter Name"
            name="filterName"
            rules={[
              {
                required: true,
                message: 'Please input the name for the filter!',
              },
            ]}
          >
            <Input placeholder="Eg: Date Range" />
          </Form.Item>
          <Form.Item label="Filter Type" name="filterType">
            <Select
              placeholder="Variable Type"
              options={WIDGET_FILTER_TYPE_OPTIONS.map((option) => ({
                value: option,
                label: startCase(humanize(option)),
              }))}
              onChange={(changedType) => {
                form.setFieldValue(
                  'defaultValue',
                  changedType === 'range' ? [0, 10] : undefined
                )
              }}
            />
          </Form.Item>
          <Form.Item
            label="Default Value"
            name="defaultValue"
            rules={[
              {
                required: filterType !== 'range',
                message: `Please input default value!`,
              },
            ]}
          >
            {filterType === 'text' ? (
              <Input placeholder="Enter a default value" />
            ) : filterType === 'range' ? (
              <Slider
                range={{ draggableTrack: true }}
                style={{ width: '96%', marginInline: 'auto' }}
              />
            ) : filterType === 'date' ? (
              <DatePicker style={{ width: '100%' }} />
            ) : filterType === 'date_range' ? (
              <DatePicker.RangePicker style={{ width: '100%' }} />
            ) : null}
          </Form.Item>
          {widgetsOnDashboard?.map((widget) => {
            const fieldsAvailable =
              widget?.widgetFilters?.filter(
                (filter: any) => filter?.type === filterType
              ) ?? []

            if (fieldsAvailable?.length === 0) return null
            return (
              <div key={widget.id}>
                <Form.Item>
                  <Typography.Text
                    style={{
                      color: '#1890ff',
                      fontSize: 'medium',
                      fontWeight: 500,
                    }}
                  >
                    {widget?.title}
                  </Typography.Text>
                </Form.Item>
                <Form.Item
                  label="Field to be mapped to"
                  name={`fieldToBeMappedTo_${widget.id}`}
                >
                  <Select
                    placeholder="Field to be mapped to"
                    options={fieldsAvailable?.map((option: any) => ({
                      value: option?.id,
                      label: option?.field_to_be_mapped,
                    }))}
                  />
                </Form.Item>
              </div>
            )
          })}
        </Form>
      </Modal>
    </div>
  )
}

export default SaveDashboardFilterModalButton
