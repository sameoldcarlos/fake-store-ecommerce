import { useLanguageStore } from '@/stores/language'
import { mapState } from 'pinia'

export default {
  props: {
    productInfo: {
      type: Object,
      default: {}
    }
  },

  inject: ['appTextData'],

  data() {
    return {
      quantity: 1
    }
  },

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
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
      const {productInfo, quantity} = this

      this.$emit('addToCart', { ...productInfo, quantity })
    },
  },
}