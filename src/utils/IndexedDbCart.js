import { openDB, deleteDB } from 'https://unpkg.com/idb@7.0.2/build/index.js?module'

const dbName = 'fakeStore'
const storeName = 'user_cart'
const version = 1
const key = 'cart_items'

export default {
  async openCartDB (version = 1) {
    let objStore
    const cartDB = await openDB(dbName, version, {
      upgrade(db) {
        objStore = db.createObjectStore(storeName)
      }
    })
    const dbInfo = ({ name: cartDB.name, store_name: cartDB.objectStoreNames[0] }) || {}
    return dbInfo
  },

  async updateCartDB(cartItems, version = 1) {
    const cartDB = await openDB(dbName, version)

    const transaction = cartDB.transaction(storeName, 'readwrite')
    const store = await transaction.objectStore(storeName)

    const result = await store.put(JSON.stringify(cartItems), key)
    await transaction.done
    return result
  },

  async getCartItemsFromDB(version = 1) {
    const cartDB = await openDB(dbName, version)
    const item = await cartDB.transaction('user_cart').objectStore('user_cart').get(key)
    
    return item ? JSON.parse(item) : []
  }
}
