import { GetDataTypeReturn } from '../utils'

export type DefaultConfForEveryField = {
  column_name: string
  display_as: string
  data_type: Exclude<GetDataTypeReturn, 'float' | 'integer'> | 'number'
  order: number
  isVisible: boolean
}

type ConfForNumbers = {
  data_type: 'number'
  decimal_places: number
  prefix: string
  suffix: string
}

type ConfForDate = {
  data_type: 'date'
  format: string
}

type ConfForText = {
  data_type: 'text'
  color: string
  font_style: string
}

type ConfForRating = {
  data_type: 'rating'
  decimal_places: number
  prefix: string
  suffix: string
}

type ConfForImage = {
  data_type: 'image'
  alt_image: string
  image_size: string
}

type ConfForLink = {
  data_type: 'link'
  href: string
  value_to_be_displayed: string
}

export type ConfForAnyField = DefaultConfForEveryField &
  (
    | ConfForNumbers
    | ConfForDate
    | ConfForImage
    | ConfForLink
    | ConfForRating
    | ConfForText
  )

export type ConfForFrontendUse = Record<string, ConfForAnyField>
