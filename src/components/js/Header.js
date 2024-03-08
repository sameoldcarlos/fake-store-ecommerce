import { getCssVariable } from "@/utils/cssVars"
import { getData } from "@/utils/CacheService"
import { isMobile } from "@/utils/breakPointsHelper"
import Menu from "@/components/Menu.vue"

import profilePicture from "@/assets/img/profile_pictures/person-2.jpeg"

export default {
  components: { Menu },

  props: {
    cartItems: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      isUserInfoVisible: false,
      iconLight: getCssVariable('primary-bg-color'),
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      userData: {},
      isWaitingUserFetch: false,
      profilePicture,
      isMobile: isMobile()
    }
  },

  methods: {
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
    }
  },

  created() {
    this.fetchUser();
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.isMobile = isMobile();
    })
  }
}
