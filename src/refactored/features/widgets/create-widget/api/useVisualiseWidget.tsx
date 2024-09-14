import { message } from 'antd'
import { useMutation } from 'react-query'

import { axios } from '~/refactored/lib/axios'
import { MutationConfig } from '~/refactored/lib/react-query'
import { useWidgetStore } from '~/refactored/stores/create-widget'

import { BackendWidget, ConfForFrontendUse } from '../types'
import { generateDefaultConfForFieldsFetched } from '../utils'

export type VisualisationData = Array<Record<string, any>>

export const visualiseWidget = (
  widgetValues: BackendWidget
): Promise<VisualisationData> => {
  return axios.post('/visualize_widget/', widgetValues)
}

type UseVisualiseWidgetOptions = {
  config?: MutationConfig<typeof visualiseWidget>
}

export const useVisualiseWidget = ({
  config,
}: UseVisualiseWidgetOptions = {}) => {
  const setVisualisationDetails = useWidgetStore('setVisualisationDetails')
  return useMutation({
    ...config,
    mutationFn: (widgetValues) => {
      const containsAxisDetails =
        widgetValues.visualisation_type === 'line_chart' ||
        widgetValues.visualisation_type === 'bar_chart' ||
        widgetValues.visualisation_type === 'pie_chart' ||
        widgetValues.visualisation_type === 'donut_chart'

      setVisualisationDetails({
        conf: widgetValues.conf[
          `${widgetValues.visualisation_type}_conf`
        ] as ConfForFrontendUse,
        title: widgetValues.title,
        type: widgetValues.visualisation_type,
        x_axis: containsAxisDetails ? widgetValues.x_axis : undefined,
        y_axis: containsAxisDetails ? widgetValues.y_axis : undefined,
      })
      return visualiseWidget(widgetValues)
    },
    onError: (error) => {
      message.error({
        content: (error as any)?.response?.data?.['error'] ? (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {(error as any).response.data['error']}
          </pre>
        ) : (
          'Verify whether all the form details are correct. If the problem still persists, then tell us how you got here and we will fix it'
        ),
      })
      setVisualisationDetails({
        data: [],
      })
    },
    onSuccess: (data) => {
      setVisualisationDetails({
        data,
        conf: generateDefaultConfForFieldsFetched(data[0]),
      })
    },
  })
}
