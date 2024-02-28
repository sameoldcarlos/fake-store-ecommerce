import formatPrice from '@/utils/formatPrice.ts'
import { getCssVariable } from '@/utils/cssVars'

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
      isFavorite: false,
      heartColor: getCssVariable('danger'),
      ratingStars: getCssVariable('rating-stars-dark')
    }
  },

  computed : {
    formattedPrice() {
      return formatPrice(this.productInfo.price) || '0'
    },

    favoriteColors() {
      const { isFavorite, heartColor } = this;

      return isFavorite ? {fill: heartColor, stroke: heartColor} : {fill: 'none', stroke: 'currentColor'}
    }
  },
  methods: {
    addProductToCart() {
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