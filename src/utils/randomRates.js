export function generateRandomRate(count) {
  let remaining = count
  const rates = {}

  for (let i = 5; i > 1; i--) {
    const rateCount = getRandomArbitrary(-1, remaining)
    rates[`rated${i}`] = rateCount

    remaining -= rateCount
  }

  rates.rated1 = remaining

  return rates
}

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}
