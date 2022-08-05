import ProductCard from "@/components/ProductCard.vue"
import Cart from "@/components/Cart.vue"
import SearchBar from "@/components/SearchBar.vue"
import AddCartModal from "@/components/AddCartModal.vue"

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
      isWaitingProductsFetch: true,
      isWaitingCategoriesFetch: true,
      isCategoriesVisible: false,
      isAddCartModalVisible: false,
      isAddingProductToCart: false
    }
  },

  computed: {
    categoriesIcon () {
      return this.isCategoriesVisible ? 'x' : 'chevron_down'
    }
  },

  methods: {
    fetchProducts (params = '', searchParam = '') {
      this.isWaitingProductsFetch = true
      this.isCategoriesVisible = false
      fetch(`https://fakestoreapi.com/products${params}`)
        .then(res => res.json())
        .then(json => {
          this.productsList = !searchParam.length ? json : json.filter(product => ({ ...product }).title.toLowerCase().includes(searchParam))
          this.isWaitingProductsFetch = false
        })
    },

    fetchCategories () {
      this.isWaitingCategoriesFetch = true
      fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(json => { 
          this.categoriesList = json
          this.isWaitingCategoriesFetch = false
        })
    },

    async addToCart (product) {
      this.isAddingProductToCart = true
      
      const alredyOnCart = this.cartItems.find(item => product.id === item.id)

      if(alredyOnCart) {
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

    searchFor (searchParam) {
      this.fetchProducts('', searchParam)
    },

    showAddToCartModal (product) {
      this.isAddCartModalVisible = true
      this.selectedProduct = product
      document.body.classList.add('modal-open')
    },

    hideAddToCartModal () {
      this.isAddCartModalVisible = false
      document.body.classList.remove('modal-open')
    }
  },

  async created () {
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
    
    this.fetchCategories()
    this.fetchProducts()
  }
}
