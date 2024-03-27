import formatPrice from '@/utils/formatPrice.ts'
import { getCssVariable } from '@/utils/cssVars'
import normalizeText from '@/utils/normalizeText'

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  props: {
    productInfo: {
      type: Object,
      default: {}
    },
    isAddingProductToCart: {
      type: Boolean,
      default: false
    },

    isFavorite: {
      type: Boolean,
      default: false
    }
  },

  inject: ['appTextData'],

  data () {
    return {
      heartColor: getCssVariable('danger'),
      ratingStars: getCssVariable('rating-stars-dark')
    }
  },

  computed : {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    formattedPrice() {
      return formatPrice(this.productInfo.price) || '0'
    },

    favoriteColors() {
      const { isFavorite, heartColor } = this

      return isFavorite ? {fill: heartColor, stroke: heartColor} : {fill: 'none', stroke: 'currentColor'}
    },

    productLink() {
      return normalizeText(this.productInfo.title)
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
      if (!this.isFavorite) {
        this.$emit('addToFavorites', this.productInfo)

        return
      }

      this.$emit('removeFromFavorites', this.productInfo)
    }
  }
}
