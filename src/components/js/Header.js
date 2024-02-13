import { getCssVariable } from "@/utils/cssVars"
import { getData } from "@/utils/CacheService"
import Menu from "@/components/Menu.vue"

export default {
  components: { Menu },

  props: {
    cartItems: {
      type: Array,
      required: true
    },

    isDisabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isUserInfoVisible: false,
      iconLight: getCssVariable('primary-bg-color'),
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      userData: {},
      isWaitingUserFetch: false
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
    }
  },

  created() {
    this.fetchUser();
  }
}