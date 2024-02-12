import { categories } from "@/utils/content"

const MENU_OPTIONS = categories.filter(item => item.value !== 'all').map(item => ({ ...item, link: `/products/${item.value}` }))

export default {
  data() {
    return {
      menuOptions: MENU_OPTIONS
    }
  }
}
