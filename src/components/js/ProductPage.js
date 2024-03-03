import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MenuMobile from '@/components/MenuMobile.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import RatingStars from '@/components/RatingStars.vue'
import RatingBars from '@/components/RatingBars.vue'
import Comments from '@/components/Comments.vue'

import CartDB from '@/utils/IndexedDbCart.js'
import { getData } from '@/utils/CacheService'
import formatPrice from '../../utils/formatPrice'

import CommentPicture from '@/assets/img/profile_pictures/person-24.jpeg'

export default {
  components: {
    Header,
    Footer,
    MenuMobile,
    SearchBar,
    ProductCarousel,
    RatingStars,
    RatingBars,
    Comments
  },

  props: {
    productId: {
      type: String,
      required: true
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
      product: {},

      comments: [
        {
          author: {
            name: 'alice',
            image: CommentPicture
          },
          text: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima minus dolore dolor, veniam enim blanditiis
              rerum atque deserunt necessitatibus repellat ipsum mollitia consequuntur officia error corporis eum consectetur modi earum.`
        }
      ]
    }
  },

  computed: {
    productPrice() {
      return formatPrice(this.product.price) || '$0,00'
    },

    installmentValue() {
      const { product: {price} } = this

      if (price) {
        const installment = Math.ceil(price/10)
        return formatPrice(installment)
      }

      return '$0,00'
    },

    installmentsCount() {
      return this.product.max_installments
    }
  },

  methods: {
    openMobileMenu() {
      this.isMobileMenuActive = true;
    },

    closeMobileMenu() {
      this.isMobileMenuActive = false;
    },

    async addToCart() {
      this.isAddingProductToCart = true

      const alreadyOnCart = this.cartItems.find(item => this.product.id === item.id)
      const {quantity, product} = this

      if (alreadyOnCart) {
        alreadyOnCart.quantity += quantity
      } else {
        const cartProduct = { ...product, quantity}
        this.cartItems.push(cartProduct)
      }

      try {
        const updateDBResult = await CartDB.updateCartDB(this.cartItems)
        console.log(updateDBResult)
        this.quantity = 1
      } catch (err) {
        console.log(err)
      }

      this.isAddingProductToCart = false
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

        this.product = await response.json().then(product => ({...product, max_installments: 10}))

      } catch (error) {
        console.error('Erro ao buscar produtos')
      } finally {
        this.isWaitingProductsFetch = false
      }
    },

    async buyNow() {
      await this.addToCart()
      this.$router.push('/checkout')
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
