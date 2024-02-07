import ProductCard from "@/components/ProductCard.vue"
import Cart from "@/components/Cart.vue"
import SearchBar from "@/components/SearchBar.vue"
import AddCartModal from "@/components/AddCartModal.vue"

import chevronDown from "@/assets/img/chevron_down.svg"
import close from "@/assets/img/x.svg"

import CartDB from '@/utils/IndexedDbCart.js'
import translatedCategories from "@/utils/translatedCategories"

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
      apiBaseUrl: new URL('/', 'https://fakestoreapi.com')
    }
  },

  computed: {
    categoriesIcon () {
      return this.isCategoriesVisible ? close : chevronDown
    }
  },

  methods: {
    async fetchUser () {
      this.isWaitingUserFetch = true

      try {
        const url = new URL('users/1', this.apiBaseUrl)
        const response = await fetch(url)

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
        const response = await fetch(url)

        this.productsList = await response.json().then(products => {
          if (!search?.length) {
            return products
          }

          return products.filter(product => product.title.toLowerCase().includes(search.toLowerCase()))
        })
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
        const response = await fetch(url)

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
