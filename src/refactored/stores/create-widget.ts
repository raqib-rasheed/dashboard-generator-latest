import { create } from 'zustand'

import { VisualisationData } from '../features/widgets/create-widget/api'
import {
  ConfForFrontendUse,
  VisualisationType,
} from '../features/widgets/create-widget/types'

type VisualisationDetails = {
  data?: VisualisationData
  type?: VisualisationType
  title?: string
  conf?: ConfForFrontendUse
  x_axis?: string
  y_axis?: string | string[]
  isVisualisationErrored?: boolean
}

export type Visualisation = {
  data?: VisualisationData
  type?: VisualisationType
  title?: string
  conf?: ConfForFrontendUse
  x_axis?: string
  y_axis?: string | string[]
  isVisualisationErrored?: boolean
  isWidgetFormUpdated: boolean
  setIsWidgetFormUpdated: (isUpdated: boolean) => void
  setConfForFieldData: (conf: ConfForFrontendUse) => void
  setVisualisationDetails: (details: VisualisationDetails) => void
  resetVisualisationStore: () => void
}

const initialState = {
  type: 'table' as VisualisationType,
  isWidgetFormUpdated: false,
  data: undefined,
  conf: undefined,
  title: undefined,
  x_axis: undefined,
  y_axis: undefined,
  isVisualisationErrored: false,
}

export const useCreateWidgetStore = create<Visualisation>((set) => ({
  ...initialState,
  setIsWidgetFormUpdated: (isUpdated) =>
    set(() => ({
      isWidgetFormUpdated: isUpdated,
    })),
  setVisualisationDetails: (details) =>
    set((state) => ({
      data: details?.data ?? state.data,
      title: details?.title ?? state.title,
      type: details?.type ?? state.type,
      conf: details?.conf ?? state.conf,
      x_axis: details?.x_axis ?? state.x_axis,
      y_axis: details?.y_axis ?? state.y_axis,
      isVisualisationErrored: details.isVisualisationErrored,
    })),
  setConfForFieldData: (conf) =>
    set(() => ({
      conf,
    })),
  resetVisualisationStore: () => set(() => ({ ...initialState })),
}))

export function useWidgetStore<T extends keyof Visualisation>(key: T) {
  return useCreateWidgetStore((state) => state[key])
}
