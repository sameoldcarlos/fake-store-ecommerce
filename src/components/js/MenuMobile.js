import { categories } from "@/utils/content.js"

const MENU_OPTIONS = categories.filter(item => item.value !== 'all').map(item => ({ ...item, link: `/products/${item.value}` }))

export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      menuOptions: MENU_OPTIONS
    }
  },

  methods: {
    closeMobileMenu() {
      this.$emit('closeMobileMenu')
    }
  }
}