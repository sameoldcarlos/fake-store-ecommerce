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

    hideAddToCartModal (event) {
      const targetClass = event.target.className
      if (targetClass === 'add-cart-modal' || targetClass === 'add-cart-modal__close') {
        this.$emit('hideAddToCartModal')
      }
    },

    addProductToCart () {
      this.$emit('addToCart', { id: this.productInfo.id, quantity: this.quantity })
    },
  },
}