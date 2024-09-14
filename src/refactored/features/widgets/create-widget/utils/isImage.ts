export function isImage(str: any) {
  if (typeof str != 'string') return false
  return str.toLowerCase().includes('image')
}
