import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MenuMobile from '@/components/MenuMobile.vue'

import CartDB from '@/utils/IndexedDbCart.js'

export default {
  components: {
    Header,
    Footer,
    MenuMobile
  },

  data() {
    return {
      cartItems: [],
      isMobileMenuActive: false
    }
  },

  methods: {
    openMobileMenu() {
      this.isMobileMenuActive = true;
    },

    closeMobileMenu() {
      this.isMobileMenuActive = false;
    }
  },

  async created() {
    try {
      this.cartItems = await CartDB.getCartItemsFromDB()
    } catch (err) {
      console.error(err)
      if (this.$route.params && this.$route.params.cart_items) {
        this.cartItems = JSON.parse(this.$route.params.cart_items)
      } else {
        this.cartItems = []
      }
    }
  }
}
