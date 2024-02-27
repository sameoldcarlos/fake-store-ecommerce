import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MenuMobile from '@/components/MenuMobile.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'

import CartDB from '@/utils/IndexedDbCart.js'
import { getData } from '@/utils/CacheService'

export default {
  components: {
    Header,
    Footer,
    MenuMobile,
    SearchBar,
    ProductCarousel
  },

  props: {
    productId: {
      type: String,
      default: '1'
    }
  },

  data() {
    return {
      cartItems: [],
      isMobileMenuActive: false,
      isAddingProductToCart: false,
      quantity: 1,
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      isWaitingProductsFetch: true,
      relatedProducts: [],
      product: {}
    }
  },

  methods: {
    openMobileMenu() {
      this.isMobileMenuActive = true;
    },

    closeMobileMenu() {
      this.isMobileMenuActive = false;
    },

    addToCart() {

    },

    incrementQuantity() {
      this.quantity++
    },

    decrementQuantity() {
      this.quantity--
    },

    async fetchRelatedProducts() {
      this.isWaitingProductsFetch = true

      const {product: {category}} = this

      const pathname = `products/category/${category || ''}`

      try {
        const url = new URL(pathname, this.apiBaseUrl)

        const response = await getData(this.appName, url)

        const products = await response.json().then(products => products)

        this.relatedProducts = products.filter(product => product.id !== this.product.id)

      } catch (error) {
        console.error('Erro ao buscar produtos')
      } finally {
        this.isWaitingProductsFetch = false
      }

    },

    async fetchProduct() {
      this.isWaitingProductsFetch = true

      const pathname = `products/${this.productId}`

      try {
        const url = new URL(pathname, this.apiBaseUrl)

        const response = await getData(this.appName, url)

        this.product = await response.json()

      } catch (error) {
        console.error('Erro ao buscar produtos')
      } finally {
        this.isWaitingProductsFetch = false
      }
    }
  },

  async created() {
    try {
      this.cartItems = await CartDB.getCartItemsFromDB()
    } catch (err) {
      console.error('Erro!', err)
      if (this.$route.params && this.$route.params.cart_items) {
        this.cartItems = JSON.parse(this.$route.params.cart_items)
      } else {
        this.cartItems = []
      }
    }

    await this.fetchProduct()
    await this.fetchRelatedProducts()
  }
}
