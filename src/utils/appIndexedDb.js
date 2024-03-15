import { openDB } from 'idb'

const dbName = 'fakeStore'
const version = 1
const key = 'cart_items'

export default {
  async openAppDB (storeName) {
    await openDB(dbName, version, {
      upgrade(db) {
        db.createObjectStore(storeName)
      }
    })
  },

  async updateAppDB(payload, storeName, key) {
    try {
      const cartDB = await openDB(dbName, version)

      const transaction = cartDB.transaction(storeName, 'readwrite')
      const store = await transaction.objectStore(storeName)
      const result = await store.put(JSON.stringify(payload), key)

      await transaction.done

      return result
    } catch (error) {
      console.error(error)
      return
    }
  },

  async getCartItemsFromDB(storeName, key) {
    try {
      const cartDB = await openDB(dbName, version)
      const item = await cartDB.transaction(storeName).objectStore(storeName).get(key)

      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
