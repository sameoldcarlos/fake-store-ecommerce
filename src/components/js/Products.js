import ProductCard from "@/components/ProductCard.vue"
import CartContainer from "@/components/CartContainer.vue"
import SearchBar from "@/components/SearchBar.vue"
import AddCartModal from "@/components/AddCartModal.vue"
import Header from "@/components/Header.vue"
import MenuMobile from "@/components/MenuMobile.vue"
import Footer from "@/components/Footer.vue"
import Toast from "@/components/Toast.vue"

import AppDB from '@/utils/appIndexedDb.js'
import { categories, formattedCategories } from "@/utils/content.js"
import { getData } from "@/utils/CacheService"
import { isMobile } from "@/utils/breakPointsHelper"

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

const SORT_OPTIONS = {
  decscendingPrice: {
    value: 'descending_price',
    label: 'Preço: do maior para o menor'
  },

  ascendingPrice: {
    value: 'ascending_price',
    label: 'Preço: do menor para o maior'
  },

  rating: {
    value: 'rating',
    label: 'Avaliação'
  }
}

export default {
  components: {
    ProductCard,
    CartContainer,
    SearchBar,
    AddCartModal,
    Header,
    MenuMobile,
    Footer,
    Toast
  },

  inject: ['appTextData'],

  data () {
    return {
      productsList: [],
      categoriesList: [],
      cartItems: this.$route.params.cart_items,
      favoriteItems: this.$route.params.favorite_items,
      selectedProduct: {},
      isWaitingProductsFetch: true,
      isWaitingCategoriesFetch: true,
      isCategoriesVisible: false,
      isAddCartModalVisible: false,
      isAddingProductToCart: false,
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      appName: import.meta.env.VITE_APP_NAME,
      selectedCategory: '',
      selectedSort: '',
      isMobileMenuActive: false,
      isCartVisible: false,
      noProductsFound: false
    }
  },

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    categoriesIcon () {
      return this.isCategoriesVisible ? 'x' : 'chevron-down'
    },

    sortOptions () {
      const { textContent: { ascending_price, descending_price, sort_by_rating } } = this

      return {
        descendingPrice: {
          value: 'descending_price',
          label: descending_price
        },

        ascendingPrice: {
          value: 'ascending_price',
          label: ascending_price
        },

        rating: {
          value: 'rating',
          label: sort_by_rating
        }
      }
    }
  },

  methods: {
    async fetchProducts ({category, search}) {
      this.isWaitingProductsFetch = true
      this.isCategoriesVisible = false

      const pathname = category?.length ? `products/category/${category}` : 'products'

      try {
        const url = new URL(pathname, this.apiBaseUrl)

        const response = await getData(this.appName, url)

        this.productsList = await response.json().then(products => {
          const preparedProducts = products.map(product => ({...product, is_favorite: this.favoriteItems.some(item => item.id === product.id)}))
          if (!search?.length) {
            return preparedProducts
          }

          return preparedProducts.filter(product => product.title.toLowerCase().includes(search.toLowerCase()))
        })

        if (!this.productsList.length) {
          this.noProductsFound = true

          return
        }
        this.noProductsFound = false

        this.sortProducts()
      } catch (error) {
        console.error('Erro ao buscar produtos')
      } finally {
        this.isWaitingProductsFetch = false
      }

    },

    async fetchCategories () {
      this.isWaitingCategoriesFetch = true

      try {
        const url = new URL('products/categories', this.apiBaseUrl)

        const response = await getData(this.appName, url)

        this.categoriesList = await response.json()
      } catch (error) {
        console.error('Erro ao consultar categorias')
      } finally {
        this.isWaitingCategoriesFetch = false
      }
    },

    async addToCart (product) {
      this.isAddingProductToCart = true

      const alredyOnCart = this.cartItems.find(item => product.id === item.id)

      if (alredyOnCart) {
        alredyOnCart.quantity += product.quantity
      } else {
        const item = this.productsList.find(item => item.id === product.id)
        item.quantity = product.quantity
        this.cartItems.push(item)
      }

      this.updateCart()

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

    addToFavorites (product) {
      const alreadyOnFavorites = this.favoriteItems.find(item => product.id === item.id)

      if (alreadyOnFavorites) {
        return
      }

      this.favoriteItems.push(product)
      product.is_favorite = true

      this.updateFavorites()
    },

    removeFromFavorites (product) {
      this.favoriteItems = this.favoriteItems.filter(item => item.id !== product.id)
      product.is_favorite = false

      this.updateFavorites()
    },

    async updateFavorites() {
      await AppDB.updateAppDB(this.favoriteItems, 'user_store', 'favorite_items')
    },

    toggleCategories () {
      this.isCategoriesVisible = !this.isCategoriesVisible
    },

    translatedCategory(category) {
      const categoryKey = category.replaceAll(/ /g, "_").replaceAll("'", "")
      const selectedCategory = categories.find(item => item.value === categoryKey)

      return this.textContent[selectedCategory.value]
    },

    showAddToCartModal (product) {
      this.isAddCartModalVisible = true
      this.selectedProduct = product
    },

    hideAddToCartModal () {
      this.isAddCartModalVisible = false
    },

    sortProducts() {
      const { selectedSort } = this
      const { ascendingPrice, decscendingPrice, rating } = SORT_OPTIONS

      if (selectedSort === ascendingPrice.value) {
        this.productsList.sort((firstItem, secondItem) => firstItem.price - secondItem.price)

        return
      }

      if (selectedSort === decscendingPrice.value) {
        this.productsList.sort((firstItem, secondItem) => secondItem.price - firstItem.price)

        return
      }

      if (selectedSort === rating.value) {
        this.productsList.sort((firstItem, secondItem) => secondItem.rating.rate - firstItem.rating.rate)
      }
    },

    openMobileMenu() {
      this.isMobileMenuActive = true
    },

    closeMobileMenu() {
      this.isMobileMenuActive = false
    },

    hideCart() {
      this.isCartVisible = false
    },

    toggleCart() {
      this.isCartVisible = !this.isCartVisible
    },

    showCart() {
      this.isCartVisible = true
    },

    async updateCart() {
      const updateDBResult = await AppDB.updateAppDB(this.cartItems, 'user_store', 'cart_items')
      console.log(updateDBResult)
    }
  },

  watch: {
    selectedCategory(category, oldCategory) {
      console.log(category)
      if (category !== oldCategory) {
        this.fetchProducts({category})
      }
    },

    selectedSort(sort, oldSort) {
      if (sort !== oldSort) {
        this.sortProducts()
      }
    }
  },

  async created () {
    await this.fetchCategories()

    const search = this.$route.query.search
    const path = this.$route.path

    const [,,categoryName] = path.split('/')
    let category = null

    if (categoryName) {
      category = formattedCategories[categoryName]?.en
    }

    await this.fetchProducts({category, search})
  }
}
