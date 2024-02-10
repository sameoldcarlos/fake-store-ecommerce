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
      const targetClass = event.target.className.split(' ').pop()

      const hidingTargetClasses = ['add-cart-modal', 'add-cart-modal__close', 'add-cart-modal__cancel']

      if (hidingTargetClasses.includes(targetClass)) {
        this.$emit('hideAddToCartModal')
      }
    },

    addProductToCart () {
      this.$emit('addToCart', { id: this.productInfo.id, quantity: this.quantity })
    },
  },
}