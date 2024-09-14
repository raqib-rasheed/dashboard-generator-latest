import { isEmpty } from 'lodash'

import { VisualisationData } from '../api'
import { ConfForFrontendUse } from '../types'
import { generateDefaultConfForFieldsFetched } from '../utils'

type Props = {
  confForFieldData?: ConfForFrontendUse
  visualisationData: VisualisationData | undefined
}

export function getConf({
  confForFieldData,
  visualisationData,
}: Props): ConfForFrontendUse {
  const conf = !isEmpty(confForFieldData)
    ? confForFieldData
    : generateDefaultConfForFieldsFetched(
        visualisationData ? visualisationData[0] : {}
      )

  return conf
}
