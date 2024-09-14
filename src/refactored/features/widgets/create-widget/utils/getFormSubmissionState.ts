import { UseMutationResult } from 'react-query'

type Params = {
  isCreating: boolean
  isVisualising: boolean
  creationStatus: UseMutationResult['status']
  visualisationStatus: UseMutationResult['status']
}

export function getFormSubmissionState({
  isCreating,
  isVisualising,
  creationStatus,
  visualisationStatus,
}: Params) {
  return isCreating
    ? 'creating'
    : isVisualising
      ? 'visualising'
      : creationStatus === 'success' || visualisationStatus === 'success'
        ? 'success'
        : creationStatus === 'error' || visualisationStatus === 'error'
          ? 'error'
          : 'idle'
}
