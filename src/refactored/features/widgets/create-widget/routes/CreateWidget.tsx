import { useWidgetStore } from '~/refactored/stores/create-widget'

import { VisualiseWidget, WidgetFormDetails } from '../components'

export function CreateWidget() {
  const visualisationData = useWidgetStore('data')
  const isWidgetFormUpdated = useWidgetStore('isWidgetFormUpdated')

  const canVisualiseWidgetSectionBeShown =
    !isWidgetFormUpdated &&
    Array.isArray(visualisationData) &&
    visualisationData.length > 0

  return (
    <>
      <WidgetFormDetails />
      {canVisualiseWidgetSectionBeShown ? <VisualiseWidget /> : null}
    </>
  )
}
