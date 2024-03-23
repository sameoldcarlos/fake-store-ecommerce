import { defineStore } from 'pinia';

export default useLanguageStore = defineStore('language', {
  state: () => ({
    selectedLanguage: 'en',
  }),

  getters: {
    getSelectedLanguage: state => state.selectedLanguage
  },

  actions: {
    setSelectedLanguage(language) {
      this.selectedLanguage = language
    }
  }
});
