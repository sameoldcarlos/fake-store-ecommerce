import { openDB, deleteDB } from 'idb'

const dbName = 'fakeStore'
const storeName = 'user_cart'
const version = 1
const key = 'cart_items'

export default {
  async openCartDB () {
    await openDB(dbName, version, {
      upgrade(db) {
        db.createObjectStore(storeName)
      }
    })
  },

  async updateCartDB(cartItems) {
    try {
      const cartDB = await openDB(dbName, version)

      const transaction = cartDB.transaction(storeName, 'readwrite')
      const store = await transaction.objectStore(storeName)
      const result = await store.put(JSON.stringify(cartItems), key)

      await transaction.done

      return result
    } catch (error) {
      console.error(error)
      return
    }
  },

  async getCartItemsFromDB() {
    try {
      const cartDB = await openDB(dbName, version)
      const item = await cartDB.transaction('user_cart').objectStore('user_cart').get(key)

      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(error)
      return []
    }
  }
}
