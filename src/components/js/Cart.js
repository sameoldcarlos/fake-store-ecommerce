import CheckoutCard from "@/components/CheckoutCard.vue"
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
    }
  },

  data () {
    return {
      cartItems: [],
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
      this.$router.replace( {params: { cart_items: JSON.stringify(spliced) } })

      this.cartItems = spliced

      this.isWaitingItemsFetch = false
    }
  },

  async created() {
    try {
      this.cartItems = await CartDB.getCartItemsFromDB()
    } catch (err) {
      this.cartItems = this.$route.params && this.$route.params.cart_items ? JSON.parse(this.$route.params.cart_items) : []
    }
    this.isWaitingItemsFetch = false
  },

  async beforeUnmount () {
    try {
      const updateDBResult = await CartDB.updateCartDB(this.cartItems)
      console.log(updateDBResult)
    } catch (err) {
      console.log(err)
    }
  }
}
