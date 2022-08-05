import formatPrice from '@/utils/formatPrice.ts'

export default {
  props: {
    productInfo: {
      type: Object,
      default: {}
    },
    index: {
      type: Number,
      default: 0
    }
  },

  computed: {
    formattedPrice() {
      return formatPrice(this.productInfo.price * this.productInfo.quantity)
    }
  },

  methods: {
    incrementQuantity () {
      this.productInfo.quantity += 1
      this.$emit('updateProductQuantity', { id: this.productInfo.id, quantity: this.productInfo.quantity })
    },
    
    decrementQuantity () {
      this.productInfo.quantity -= 1
      if (this.productInfo.quantity <= 0) {
        this.$emit('removeProductFromCart', this.index)
      } else {
        this.$emit('updateProductQuantity', { id: this.productInfo.id, quantity: this.productInfo.quantity })
      }
    }
  },

  mounted() {
    if (this.productInfo && Object.keys(this.productInfo).length) {
      this.quantity = this.productInfo.quantity
    }
  },
}
