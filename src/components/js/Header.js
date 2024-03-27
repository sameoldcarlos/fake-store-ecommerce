import { getCssVariable } from "@/utils/cssVars"
import { getData } from "@/utils/CacheService"
import { isMobile } from "@/utils/breakPointsHelper"
import Menu from "@/components/Menu.vue"

import profilePicture from "@/assets/img/profile_pictures/person-2.jpeg"
import brazilFlag from "@/assets/img/flags/brazil.svg"
import usaFlag from "@/assets/img/flags/us.svg"
import mexicoFlag from "@/assets/img/flags/mexico.svg"

import { mapActions, mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  components: { Menu },

  props: {
    cartItems: {
      type: Array,
      required: true
    }
  },

  inject: ['appTextData'],

  data() {
    return {
      isUserInfoVisible: false,
      iconLight: getCssVariable('primary-bg-color'),
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      userData: {},
      isWaitingUserFetch: false,
      profilePicture,
      isMobile: isMobile(),
      flags: {
        brazil: brazilFlag,
        usa: usaFlag,
        mexico: mexicoFlag
      },
      isLangOptionsVisible: false
    }
  },

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    selectedLanguageFlag() {
      if (this.selectedLanguage === 'pt') {
        return this.flags.brazil
      }

      if (this.selectedLanguage === 'en') {
        return this.flags.usa
      }

      return this.flags.mexico
    }
  },

  methods: {
    ...mapActions(useLanguageStore, ['setSelectedLanguage']),

    async fetchUser() {
      this.isWaitingUserFetch = true

      try {
        const url = new URL('users/1', this.apiBaseUrl)

        const response = await getData(this.appName, url)

        this.userData = await response.json()
      } catch (error) {
        console.error('Erro ao consultar informações do usuário')
      } finally {
        this.isWaitingUserFetch = false
      }
    },

    openMobileMenu() {
      this.$emit('openMobileMenu')
    },

    toggleCart() {
      this.$emit('toggleCart')
    },

    openLangOptions() {
      this.isLangOptionsVisible = true
    }
  },

  async created() {
    await this.fetchUser()
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.isMobile = isMobile()
    })
  },

  watch: {
    selectedLanguage() {
      this.isLangOptionsVisible = false
    }
  }
}
