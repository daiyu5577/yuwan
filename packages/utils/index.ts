export const generateUid = (prefix = '') => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
}