import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

let selectedLanguage = (Cookies.get('language'))

if (!selectedLanguage) {
  Cookies.set('language', 'en')
  selectedLanguage = 'en'
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    selectedLanguage,
  }),

  getters: {
    getSelectedLanguage: state => state.selectedLanguage
  },

  actions: {
    setSelectedLanguage(language) {
      this.selectedLanguage = language
      Cookies.set('language', language, { sameSite: 'strict' })
    }
  }
})
