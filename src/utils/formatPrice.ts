const formatPrice = (value: number): string => {
  const priceFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  const result = priceFormat.format(value).replace('R', '')
  return result
}

export default formatPrice
