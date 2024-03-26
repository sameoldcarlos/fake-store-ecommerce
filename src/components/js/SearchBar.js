import { getCssVariable } from "@/utils/cssVars"

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  data () {
    return {
      searchParam: '',
      strokeColor: getCssVariable('highlight-dark')
    }
  },

  inject: ['appTextData'],

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    }
  },

  methods: {
    submit() {
      this.$emit('searchFor', this.searchParam)
    }
  }
}