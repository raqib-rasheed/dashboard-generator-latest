import { isNumber } from 'lodash'

export function isNumeric(str: any): false | 'integer' | 'float' {
  if (isNumber(str)) {
    return Number.isInteger(str) ? 'integer' : 'float'
  }

  if (typeof str !== 'string') {
    return false
  }

  const isParsedANumber = !isNaN(str as any) && !isNaN(parseFloat(str))
  if (isParsedANumber) {
    const parsed = parseFloat(str)
    return Number.isInteger(parsed) ? 'integer' : 'float'
  }

  return false
}
