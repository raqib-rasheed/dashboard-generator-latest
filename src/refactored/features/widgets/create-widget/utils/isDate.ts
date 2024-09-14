export function isDate(text: any) {
  return typeof text === 'string' && new Date(text).getTime() > 0
}
