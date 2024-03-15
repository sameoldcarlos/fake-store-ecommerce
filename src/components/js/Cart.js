import CheckoutCard from '@/components/CheckoutCard.vue'
import CartDB from '@/utils/IndexedDbCart.js'
import formatPrice from '@/utils/formatPrice.ts'

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

  data () {
    return {
      cartItems: this.$route.params.cart_items,
      isWaitingItemsFetch: true
    }
  },

  computed: {
    subtotal() {
      if (!this.cartItems.length ) {
        return 'R$ 0,00'
      }

      let subtotal = 0
      this.cartItems.forEach(item => {
        const cartItem = { ...item }
        subtotal += cartItem.price * cartItem.quantity
      })

      return `R${formatPrice(subtotal)}`
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
        const updateDBResult = await CartDB.updateCartDB(this.cartItems)
        this.$route.params.cart_items = this.cartItems
        console.log(updateDBResult)
      } catch (err) {
        console.log(err)
      }
    }
  },

  async beforeUnmount () {
    try {
      const updateDBResult = await CartDB.updateCartDB(this.cartItems)
      this.$route.params.cart_items = this.cartItems
      console.log(updateDBResult)
    } catch (err) {
      console.log(err)
    }
  }
}
