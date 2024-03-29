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
import AddCartModal from '@/components/AddCartModal.vue'

import AppDB from '@/utils/appIndexedDb.js'
import { getData } from '@/utils/CacheService'
import formatPrice from '@/utils/formatPrice'
import { isMobile } from '@/utils/breakPointsHelper'
import { getCssVariable } from '@/utils/cssVars'

import CommentPicture from '@/assets/img/profile_pictures/person-24.jpeg'

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

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
    CartContainer,
    AddCartModal
  },

  props: {
    productId: {
      type: String,
      required: true
    }
  },

  inject: ['appTextData'],

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
      carouselProduct: {},
      isAddCartModalVisible: false,
      favoriteItems: this.$route.params.favorite_items,

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
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

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
    },

    favoriteFill() {
      return this.isFavorite ? getCssVariable('danger') : 'none'
    },

    favoriteStroke() {
      return this.isFavorite ? getCssVariable('danger') : 'currentColor'
    },

    isFavorite() {
      return this.favoriteItems.some(item => item.id === this.product.id)
    },

    installmentsText() {
      const { textContent: { or_pay_in, installments, of } } = this

      return `${or_pay_in} ${this.installmentsCount} ${installments} ${of} ${this.installmentValue}`
    }
  },

  methods: {
    openMobileMenu() {
      this.isMobileMenuActive = true
    },

    closeMobileMenu() {
      this.isMobileMenuActive = false
    },

    toggleFavorite() {
      if (!this.isFavorite) {
        this.addToFavorites(this.product)

        return
      }

      this.removeFromFavorites(this.product)
    },

    async addToCart(product) {
      this.isAddingProductToCart = true

      const alreadyOnCart = this.cartItems.find(item => product.id === item.id)

      if (alreadyOnCart) {
        alreadyOnCart.quantity += product.quantity
      } else {
        this.cartItems.push(product)
      }

      await this.updateCart()

      this.isAddingProductToCart = false

      this.hideAddToCartModal()

      this.$refs.toast.show({
        toast_type: 'success',
        toast_title: 'Adicionado ao carrinho',
        message: `${product.title}. ${product.quantity} unidade${product.quantity > 1 ? 's' : ''}.`
      })

      if (!isMobile()) {
        this.showCart()
      }
    },

    addToFavorites(product) {
      const alreadyOnFavorites = this.favoriteItems.find(item => product.id === item.id)

      if (alreadyOnFavorites) {
        return
      }

      this.favoriteItems.push(product)
      product.is_favorite = true

      this.updateFavorites()
    },

    removeFromFavorites(product) {
      this.favoriteItems = this.favoriteItems.filter(item => item.id !== product.id)
      product.is_favorite = false

      this.updateFavorites()
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

        this.relatedProducts = products.filter(product => product.id !== this.product.id).map(product => ({...product, is_favorite: this.favoriteItems.some(item => item.id === product.id)}))

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
      const {product, quantity} = this

      await this.addToCart({...product, quantity})
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
    },

    showAddToCartModal(product) {
      this.carouselProduct = product
      this.hideCart()
      this.isAddCartModalVisible = true
    },

    hideAddToCartModal() {
      this.isAddCartModalVisible = false
    },

    searchFor(searchParam) {
      this.$router.push({name: 'products', query: {search: searchParam}})
    },

    async updateCart() {
      const updateDBResult = await AppDB.updateAppDB(this.cartItems, 'user_store', 'cart_items')
      console.log(updateDBResult)
    },

    async updateFavorites() {
      const updateDBResult = await AppDB.updateAppDB(this.favoriteItems, 'user_store', 'favorite_items')
      console.log(updateDBResult)
    },
  },

  async created() {
    await this.fetchProduct()
    await this.fetchRelatedProducts()
  }
}
