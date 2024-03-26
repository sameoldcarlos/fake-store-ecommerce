<template>
  <main class="not-found-main">
    <h1>{{ textContent.oops }}</h1>
    <h4>{{ textContent.page_not_found }}</h4>
    <img
      src="@/assets/img/bg_404.svg"
      alt="Página não encontrada"
      width="500"
    >
  </main>
</template>
<script>
import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  inject: ['appTextData'],

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    }
  }
}
</script>
<style lang="scss">
  .not-found-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0;

    img {
      width: 100%;
      max-width: 500px;
      object-fit: contain;
    }

    h1, h4 {
      width: 100%;
      max-width: 500px;
      padding: 0 20px;
      text-align: left;
    }
  }
</style>
