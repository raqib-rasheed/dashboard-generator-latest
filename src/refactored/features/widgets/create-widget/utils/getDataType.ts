import { isDate } from './isDate'
import { isImage } from './isImage'
import { isNumeric } from './isNumeric'
import { isRating } from './isRating'
import { isUrl } from './isUrl'

export const getDataType = (key: string, value: string | number) => {
  return isDate(value)
    ? 'date'
    : isRating(key)
      ? 'rating'
      : isNumeric(value) === 'float'
        ? 'float'
        : isNumeric(value) === 'integer'
          ? 'integer'
          : isImage(key)
            ? 'image'
            : isUrl(value)
              ? 'link'
              : 'text'
}

export type GetDataTypeReturn = ReturnType<typeof getDataType>
