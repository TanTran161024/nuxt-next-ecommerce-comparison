export const formatVnd = (value: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)

export const hasOriginalPrice = (originalPrice: number | null): originalPrice is number => originalPrice !== null
