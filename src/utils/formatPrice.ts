const formatPrice = (value: number): string => {
  const priceFormat = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD'
  })

  const result = priceFormat.format(value)
  return result
}

export default formatPrice
