import { titleize } from 'inflection'

import { VisualisationData } from '../api'
import {
  ConfForFrontendUse,
  ConfForAnyField,
  DefaultConfForEveryField,
} from '../types'

import { getDataType } from './getDataType'

export function generateDefaultConfForFieldsFetched(
  firstElement: VisualisationData[number]
) {
  const configuration: ConfForFrontendUse = {}
  Object.keys(firstElement).forEach((key, index) => {
    const value = firstElement[key]
    const dataType = getDataType(key, value)
    const commonAttributes: DefaultConfForEveryField = {
      column_name: titleize(key),
      display_as: titleize(key),
      data_type:
        dataType === 'float' || dataType === 'integer' ? 'number' : dataType,
      order: index,
      isVisible: true,
    }

    const finalKeyConfig = {
      ...commonAttributes,
    } as ConfForAnyField

    switch (finalKeyConfig.data_type) {
      case 'number':
        finalKeyConfig.decimal_places = dataType === 'float' ? 2 : 0
        finalKeyConfig.prefix = ''
        finalKeyConfig.suffix = ''
        break
      case 'rating':
        finalKeyConfig.decimal_places = 2
        finalKeyConfig.prefix = ''
        finalKeyConfig.suffix = ''
        break
      case 'date':
        finalKeyConfig.format = 'YYYY/MM/DD'
        break
      case 'image':
        finalKeyConfig.alt_image = ''
        finalKeyConfig.image_size = '1'
        break
      case 'link':
        finalKeyConfig.href = ''
        finalKeyConfig.value_to_be_displayed = value
        break
      case 'text':
        finalKeyConfig.color = 'default'
        finalKeyConfig.font_style = 'normal'
        break
    }

    configuration[key] = finalKeyConfig
  })
  return configuration
}
