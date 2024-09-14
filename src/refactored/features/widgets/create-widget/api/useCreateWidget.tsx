import { message, notification } from 'antd'
import { useMutation } from 'react-query'

import { useNavigateBackToRedirect } from '~/refactored/hooks'
import { axios } from '~/refactored/lib/axios'
import { MutationConfig } from '~/refactored/lib/react-query'
import { useWidgetStore } from '~/refactored/stores/create-widget'

import { BackendWidget } from '../types'

type CreateWidgetResponseData = BackendWidget & { id: number }

export const createWidget = (
  widgetValues: BackendWidget
): Promise<CreateWidgetResponseData> => {
  return axios.post('/widgets/', widgetValues)
}

type UseCreateWidgetOptions = {
  config?: MutationConfig<typeof createWidget>
}

export const useCreateWidget = ({ config }: UseCreateWidgetOptions = {}) => {
  const resetVisualisationStore = useWidgetStore('resetVisualisationStore')
  const navigateBackToRedirect = useNavigateBackToRedirect()

  return useMutation({
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
    },
    onSuccess: (data) => {
      if (data?.id) {
        notification.success({
          duration: 3,
          message: 'Widget Created',
          description: 'New Widget successfully created!',
        })
        navigateBackToRedirect()
        resetVisualisationStore()
      }
    },
    ...config,
    mutationFn: createWidget,
  })
}
