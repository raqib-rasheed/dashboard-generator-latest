import { notification } from 'antd'
import { useQuery } from 'react-query'

import { axios } from '~/refactored/lib/axios'
import { ExtractFnReturnType, QueryConfig } from '~/refactored/lib/react-query'

import { ConnectionResponseData } from '../types'

export const getConnections = (): Promise<ConnectionResponseData[]> => {
  return axios.get('/connections/')
}

type QueryFn = typeof getConnections

type UseGetConnectionsOptions = {
  config?: QueryConfig<QueryFn>
}

export const useGetConnections = ({
  config,
}: UseGetConnectionsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFn>>({
    ...config,
    onError: () => {
      notification.error({
        duration: 3,
        message: 'Error',
        description:
          "There's an error fetching connections. Please try again after some time!",
      })
    },
    queryKey: ['connections'],
    queryFn: getConnections,
  })
}
