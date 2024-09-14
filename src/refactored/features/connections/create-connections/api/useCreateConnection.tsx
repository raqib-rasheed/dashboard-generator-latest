import { notification } from 'antd'
import { useMutation, useQueryClient } from 'react-query'

import { useNavigateBackToRedirect } from '~/refactored/hooks'
import { axios } from '~/refactored/lib/axios'
import { MutationConfig } from '~/refactored/lib/react-query'

import { BackendConnectionPayload, ConnectionResponseData } from '../types'

export const createConnection = (
  connectionPayload: BackendConnectionPayload
): Promise<ConnectionResponseData> => {
  return axios.post('/connections/', connectionPayload)
}

type UseCreateConnectionOptions = {
  config?: MutationConfig<typeof createConnection>
}

export const useCreateConnection = ({
  config,
}: UseCreateConnectionOptions = {}) => {
  const queryClient = useQueryClient()
  const navigateBackToRedirect = useNavigateBackToRedirect()

  return useMutation({
    onError: (error) => {
      notification.error({
        message: 'Error occurred when creating connection!',
        description: (error as any)?.response?.data?.['error'] ? (
          <>
            <br />
            <p>error: {(error as any).response.data['error']}</p>
          </>
        ) : (
          <>
            <br />
            <p>Please verify whether all the connection details are correct!</p>
            <p>
              If everything is correct, then tell us how you got here and we
              will fix it
            </p>
          </>
        ),
      })
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['connections'] })
        notification.success({
          duration: 3,
          message: 'Connection Created',
          description: 'New Connection successfully created!',
        })
        navigateBackToRedirect()
      }
    },
    ...config,
    mutationFn: createConnection,
  })
}
