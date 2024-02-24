export default {
  props: {
    productInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      quantity: 1
    }
  },
  
  methods: {
    incrementQuantity () {
      this.quantity += 1
    },

    decrementQuantity () {
      this.quantity -= 1
    },

    hideAddToCartModal () {
      this.$emit('hideAddToCartModal')
    },

    addProductToCart () {
      this.$emit('addToCart', { id: this.productInfo.id, quantity: this.quantity })
    },
  },
}