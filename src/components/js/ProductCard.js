import iconHeart from '@/assets/img/icon_heart.svg'
import iconHeartFill from '@/assets/img/icon_heart_filled.svg'

import formatPrice from '@/utils/formatPrice.ts'

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
      return formatPrice(this.productInfo.price) || '0'
    },

    favoriteIcon () {
      return this.isFavorite ? iconHeartFill : iconHeart
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