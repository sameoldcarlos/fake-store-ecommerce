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
      heartColor: getCssVariable('danger')
    }
  },

  computed : {
    formattedPrice () {
      return formatPrice(this.productInfo.price) || '0'
    },

    favoriteFill () {
      return this.isFavorite ? this.heartColor : 'none'
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