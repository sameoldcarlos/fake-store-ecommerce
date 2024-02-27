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
    product: {
      type: Object,
      default: {
        category: "men's clothing",
        description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        id: 1,
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        price: 109.95,
        rating: {
          count: 120,
          rate: 3.9
        },
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"
      }
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
      relatedProducts: []
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

    await this.fetchRelatedProducts()
  }
}
