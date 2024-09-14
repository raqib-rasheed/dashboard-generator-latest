import { Button, Card } from 'antd'
import { humanize } from 'inflection'
import { startCase } from 'lodash'
import { ReactSortable } from 'react-sortablejs'

import { useWidgetStore } from '~/refactored/stores/create-widget'

import {
  KeyConfigurationPopoverForm,
  HideOrShowColumnButton,
  DragHandleButton,
} from './components'
import { useConfOrderState } from './hooks/useConfOrderState'

export const ConfigureWidget = () => {
  const visualisationType = useWidgetStore('type')
  const conf = useWidgetStore('conf')
  const xAxis = useWidgetStore('x_axis')
  const yAxis = useWidgetStore('y_axis')
  const setConfForFieldData = useWidgetStore('setConfForFieldData')

  const { confOrder, setConfOrder, orderSortedFormValues } = useConfOrderState({
    conf,
    visualisationType,
    xAxis,
    yAxis,
  })

  function easyHandleSubmit() {
    setConfForFieldData(orderSortedFormValues)
  }

  function pullFormValues(formValues: any) {
    setConfOrder(
      Object.keys(formValues)?.map((key) => ({
        ...formValues[key],
        id: key,
      }))
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <ReactSortable
        list={confOrder}
        setList={setConfOrder}
        handle=".DragHandle"
        animation={150}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {confOrder
          ?.filter((confSetting) => {
            if (
              visualisationType === 'pie_chart' ||
              visualisationType === 'donut_chart'
            ) {
              return yAxis === confSetting.id
            }
            return true
          })
          ?.map((confSetting) => {
            return (
              <Card key={confSetting.id} bodyStyle={{ padding: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBlock: '10px',
                    paddingInline: '5px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                    }}
                  >
                    <KeyConfigurationPopoverForm
                      id={confSetting.id}
                      conf={conf?.[confSetting.id]}
                      passFormValuesToParent={pullFormValues}
                      initialFormValues={orderSortedFormValues}
                    />
                    <span>{startCase(humanize(confSetting.id))}</span>
                  </div>
                  {visualisationType === 'table' ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                      }}
                    >
                      <HideOrShowColumnButton
                        id={confSetting.id}
                        isVisible={confSetting?.isVisible}
                        passFormValuesToParent={pullFormValues}
                        initialFormValues={orderSortedFormValues}
                      />
                      <DragHandleButton />
                    </div>
                  ) : null}
                </div>
              </Card>
            )
          })}
      </ReactSortable>
      <Button type="primary" onClick={easyHandleSubmit}>
        Try it out
      </Button>
    </div>
  )
}
