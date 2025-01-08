export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0'
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
