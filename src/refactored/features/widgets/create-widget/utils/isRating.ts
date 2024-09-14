export function isRating(str: any) {
  if (typeof str != 'string') return false
  return str.toLowerCase().includes('rating')
}
