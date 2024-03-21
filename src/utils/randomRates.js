export function generateRandomRate(ratingCount, averageRating) {
  const ratingSum = Math.floor(ratingCount * averageRating)

  const ratingDistribution = new Array(ratingCount).fill(1)

  const remaining = ratingSum - ratingCount

  for (let i = 0; i < remaining; i++) {
    const randomIndex = Math.floor(Math.random() * ratingCount)

    if (ratingDistribution[randomIndex] < 5) {
      ratingDistribution[randomIndex]++
    }
  }

  const ratings = {
    rated5: 0,
    rated4: 0,
    rated3: 0,
    rated2: 0,
    rated1: 0
  }

  ratingDistribution.forEach(rating => {
    ratings[`rated${rating}`]++
  })

  return ratings
}
