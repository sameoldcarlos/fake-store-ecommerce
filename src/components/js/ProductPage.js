import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import MenuMobile from '@/components/MenuMobile.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import RatingStars from '@/components/RatingStars.vue'
import RatingBars from '@/components/RatingBars.vue'
import Comments from '@/components/Comments.vue'
import Toast from '@/components/Toast.vue'
import CartContainer from '@/components/CartContainer.vue'

import CartDB from '@/utils/IndexedDbCart.js'
import { getData } from '@/utils/CacheService'
import formatPrice from '@/utils/formatPrice'
import { isMobile } from '@/utils/breakPointsHelper'

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
    Comments,
    Toast,
    CartContainer
  },

  props: {
    productId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isMobileMenuActive: false,
      isAddingProductToCart: false,
      quantity: 1,
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      isWaitingProductsFetch: true,
      relatedProducts: [],
      product: {},
      cartItems: this.$route.params.cart_items,
      isCartVisible: false,

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
        const installment = (price / this.installmentsCount).toFixed(2)
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
      const cartProduct = { ...product, quantity}

      if (alreadyOnCart) {
        alreadyOnCart.quantity += quantity
      } else {
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

      this.$refs.toast.show({
        toast_type: 'success',
        toast_title: 'Adicionado ao carrinho',
        message: `${cartProduct.title}. ${cartProduct.quantity} unidade${cartProduct.quantity > 1 ? 's' : ''}.`
      })

      console.log(isMobile())

      if (!isMobile()) {
        this.showCart()
      }
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
    },

    showCart() {
      this.isCartVisible = true
    },

    hideCart() {
      this.isCartVisible = false
    },

    toggleCart() {
      this.isCartVisible = !this.isCartVisible
    }
  },

  async created() {
    await this.fetchProduct()
    await this.fetchRelatedProducts()
  }
}
