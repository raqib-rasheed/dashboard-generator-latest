import { default as dayjs } from 'dayjs'

import { DEFAULT_DATE_FORMAT } from '~/refactored/const'

export const formatDate = (date: Date, format: string = DEFAULT_DATE_FORMAT) =>
  dayjs(date).format(format)
