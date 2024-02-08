export async function getData(cacheName, url) {
  let response = await getCachedData(cacheName, url)

  if (!response || !response.ok) {
    response = await fetch(url)
    const cache = await caches.open(cacheName)
    cache.put(url, response.clone())
  }

  return response
}

export async function getCachedData(cacheName, url) {
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(url)

  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }
  
  return cachedResponse
}
