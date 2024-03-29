import CheckoutCard from '@/components/CheckoutCard.vue'
import AppDB from '@/utils/appIndexedDb.js'
import formatPrice from '@/utils/formatPrice.ts'

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  components: {
    CheckoutCard
  },

  props: {
    isVisible: {
      type: Boolean,
      default: false
    },

    redirectPathName: {
      type: String,
      default: 'home'
    }
  },

  inject: ['appTextData'],

  data () {
    return {
      cartItems: this.$route.params.cart_items,
      isWaitingItemsFetch: true
    }
  },

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    subtotal() {
      if (!this.cartItems.length ) {
        return 'R$ 0,00'
      }

      let subtotal = 0
      this.cartItems.forEach(item => {
        const cartItem = { ...item }
        subtotal += cartItem.price * cartItem.quantity
      })

      return `${formatPrice(subtotal)}`
    }
  },

  methods: {
    updateProductQuantity(productInfo) {
      if(this.cartItems.length) {
        const product = this.cartItems.find(item => {
          const cartItem = { ...item }
          if (cartItem.id === productInfo.id) {
            return cartItem
          }
        })
        product.quantity = productInfo.quantity
      }
    },

    removeProductFromCart(productIndex) {
      this.isWaitingItemsFetch = true

      const spliced = this.cartItems.toSpliced(productIndex, 1)
      this.$router.replace( {params: { cart_items: spliced } })

      this.cartItems = spliced

      this.$emit('updateCart', this.cartItems)

      this.isWaitingItemsFetch = false
    },

    finishRedirect() {
      this.$router.push({ name: this.redirectPathName })
    }
  },

  watch: {
    async cartItems(value) {
      this.$route.params.cart_items = value

      try {
        const updateDBResult = await AppDB.updateAppDB(this.cartItems, 'user_store', 'cart_items')
        this.$route.params.cart_items = this.cartItems
        console.log(updateDBResult)
      } catch (err) {
        console.log(err)
      }
    }
  },

  async beforeUnmount () {
    try {
      const updateDBResult = await AppDB.updateAppDB(this.cartItems, 'user_store', 'cart_items')
      this.$route.params.cart_items = this.cartItems
      console.log(updateDBResult)
    } catch (err) {
      console.log(err)
    }
  }
}
