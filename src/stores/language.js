import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
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
