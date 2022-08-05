export default {
  props: {
    productInfo: {
      type: Object,
      default: {}
    },
    isAddingProductToCart: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isFavorite: false
    }
  },

  computed : {
    formattedPrice () {
      const result = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(this.productInfo.price)
      return result.replace('US', '')
    },

    favoriteIcon () {
      return this.isFavorite ? 'heart_filled' : 'heart'
    }
  },
  methods: {
    addProductToCart () {
      this.productInfo.quantity = 1
      this.$emit('addToCart', this.productInfo)
    },

    showAddToCartModal() {
      this.$emit('showAddToCartModal', this.productInfo)
    },

    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    }
  }
}