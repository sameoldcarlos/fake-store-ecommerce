import ProductCard from "@/components/ProductCard.vue"
import Cart from "@/components/Cart.vue"
import SearchBar from "@/components/SearchBar.vue"
import AddCartModal from "@/components/AddCartModal.vue"

import CartDB from '@/utils/IndexedDbCart.js'
import translatedCategories from "@/utils/translatedCategories"
import { getData } from "@/utils/CacheService"
import { getCssVariable } from "@/utils/cssVars"

const ORDER_OPTIONS = {
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
    Cart,
    SearchBar,
    AddCartModal
  },

  data () {
    return {
      productsList: [],
      categoriesList: [],
      cartItems: [],
      selectedProduct: {},
      userData: {},
      isWaitingProductsFetch: true,
      isWaitingCategoriesFetch: true,
      isCategoriesVisible: false,
      isAddCartModalVisible: false,
      isAddingProductToCart: false,
      isWaitingUserFetch: true,
      isUserInfoVisible: false,
      apiBaseUrl: new URL('/', import.meta.env.VITE_API_BASE_URL),
      appName: import.meta.env.VITE_APP_NAME,
      highlightColor: getCssVariable('highlight'),
      selectedCategory: '',
      selectedOrder: '',
      orderOptions: ORDER_OPTIONS
    }
  },

  computed: {
    categoriesIcon () {
      return this.isCategoriesVisible ? 'x' : 'chevron-down'
    }
  },

  methods: {
    async fetchUser () {
      this.isWaitingUserFetch = true

      try {
        const url = new URL('users/1', this.apiBaseUrl)
        
        const response = await getData(this.appName, url)

        this.userData = await response.json()
      } catch (error) {
        console.error('Erro ao consultar informações do usuário')
      } finally {
        this.isWaitingUserFetch = false
      }
    },

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
    },

    toggleCategories () {
      this.isCategoriesVisible = !this.isCategoriesVisible
    },

    translatedCategory(category) {
      const cat = category.replaceAll(/ /g, "_").replaceAll("'", "")
      return translatedCategories[cat]
    },

    showAddToCartModal (product) {
      this.isAddCartModalVisible = true
      this.selectedProduct = product
    },

    hideAddToCartModal () {
      this.isAddCartModalVisible = false
    },

    sortProducts() {
      const { selectedOrder } = this;
      const { ascendingPrice, decscendingPrice, rating } = ORDER_OPTIONS

      if (selectedOrder === ascendingPrice.value) {
        this.productsList.sort((firstItem, secondItem) => firstItem.price - secondItem.price)
        
        return
      }

      if (selectedOrder === decscendingPrice.value) {
        this.productsList.sort((firstItem, secondItem) => secondItem.price - firstItem.price)

        return
      }

      if (selectedOrder === rating.value) {
        this.productsList.sort((firstItem, secondItem) => secondItem.rating.rate - firstItem.rating.rate)
      }
    }
  },

  watch: {
    selectedCategory(category, oldCategory) {
      if (category !== oldCategory) {
        this.fetchProducts({category})
      }
    },

    selectedOrder(order, oldOrder) {
      if (order !== oldOrder) {
        this.sortProducts()
      }
    }
  },

  async created () {
    await this.fetchUser()
    try {
      const openDBResult = await CartDB.openCartDB()
      this.cartItems = await CartDB.getCartItemsFromDB()
    } catch (err) {
      if (this.$route.params && this.$route.params.cart_items) {
        this.cartItems = JSON.parse(this.$route.params.cart_items)
      } else {
        this.cartItems = []
      }
    }
    
    this.isWaitingItemsFetch = false
    
    await this.fetchCategories()
    await this.fetchProducts({})
  }
}
