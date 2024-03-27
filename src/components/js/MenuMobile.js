import { categories } from '@/utils/content.js'

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },

  inject: ['appTextData'],

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    menuOptions() {
      const { textContent } = this
      return categories.filter(item => item.value !== 'all').map(item => ({ ...item, label: textContent[item.value], link: `/products/${item.value}` }))
    }
  },

  methods: {
    closeMobileMenu() {
      this.$emit('closeMobileMenu')
    }
  }
}