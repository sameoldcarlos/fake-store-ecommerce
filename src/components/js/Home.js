import ProductCard from "@/components/ProductCard.vue"
import CartContainer from "@/components/CartContainer.vue"
import SearchBar from "@/components/SearchBar.vue"
import AddCartModal from "@/components/AddCartModal.vue"
import Header from "@/components/Header.vue"
import MenuMobile from "@/components/MenuMobile.vue"
import Footer from "@/components/Footer.vue"

import CartDB from '@/utils/IndexedDbCart.js'
import { categories } from "@/utils/content.js"
import { getData } from "@/utils/CacheService"

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
    Footer
  },

  data () {
    return {
      productsList: [],
      categoriesList: [],
      cartItems: this.$route.params.cart_items,
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
      sortOptions: SORT_OPTIONS,
      isMobileMenuActive: false,
      isCartVisible: false
    }
  },

  computed: {
    categoriesIcon () {
      return this.isCategoriesVisible ? 'x' : 'chevron-down'
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
          if (!search?.length) {
            return products
          }

          return products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()))
        })

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

      try {
        const updateDBResult = await CartDB.updateCartDB(this.cartItems)
        console.log(updateDBResult)
      } catch (err) {
        console.log(err)
      }

      this.isAddingProductToCart = false
      this.hideAddToCartModal()
      this.showCart()
    },

    toggleCategories () {
      this.isCategoriesVisible = !this.isCategoriesVisible
    },

    translatedCategory(category) {
      const categoryKey = category.replaceAll(/ /g, "_").replaceAll("'", "")
      const selectedCategory = categories.find(item => item.value === categoryKey)

      return selectedCategory.label
    },

    showAddToCartModal (product) {
      this.isAddCartModalVisible = true
      this.selectedProduct = product
    },

    hideAddToCartModal () {
      this.isAddCartModalVisible = false
    },

    sortProducts() {
      const { selectedSort } = this;
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
    }
  },

  watch: {
    selectedCategory(category, oldCategory) {
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
    await this.fetchProducts({})
  }
}
