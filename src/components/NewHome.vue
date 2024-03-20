<template>
  <Header
    :cart-items="cartItems"
    @openMobileMenu="openMobileMenu"
    @toggleCart="toggleCart"
  ></Header>
  <MenuMobile
    :is-active="isMobileMenuActive"
    @closeMobileMenu="closeMobileMenu"
  />
  <aside class="cart-container">
    <CartContainer
      class="cart--aside"
      :is-visible="isCartVisible"
      @hideCart="hideCart"
      @updateCart="updateCart"
    ></CartContainer>
  </aside>
  <main class="main-container">
    <section class="promoted-product-section">
      <img :src="promotedProductBanner" :alt="promotedProduct.title">
    </section>
    <section class="product-page__section related-products">
      <h2 class="text-center mb-5">Mais da categoria Eletrônicos</h2>
      <ProductCarousel
        v-if="!isWaitingProductsFetch && relatedProducts.length"
          :products="relatedProducts"
          @showAddToCartModal="showAddToCartModal"
          @addToFavorites="addToFavorites"
          @removeFromFavorites="removeFromFavorites"
      ></ProductCarousel>
    </section>
    <section class="product-page__section related-products">
      <h2 class="text-center mb-5">Mais vendidos</h2>
      <ProductCarousel
        v-if="!isWaitingProductsFetch && mostBoughtProducts.length"
        :products="mostBoughtProducts"
        @showAddToCartModal="showAddToCartModal"
        @addToFavorites="addToFavorites"
        @removeFromFavorites="removeFromFavorites"
      ></ProductCarousel>
    </section>
    <section class="product-page__section related-products">
      <h2 class="text-center mb-5">Melhor avaliados</h2>
      <ProductCarousel
        v-if="!isWaitingProductsFetch && bestRatedProducts.length"
          :products="bestRatedProducts"
          @showAddToCartModal="showAddToCartModal"
          @addToFavorites="addToFavorites"
          @removeFromFavorites="removeFromFavorites"
      ></ProductCarousel>
    </section>
    <section class="product-page__section related-products">
      <h2 class="text-center mb-5">Seus Favoritos</h2>
      <ProductCarousel
        v-if="!isWaitingProductsFetch && favoriteProducts.length"
        :products="favoriteProducts"
        @showAddToCartModal="showAddToCartModal"
        @addToFavorites="addToFavorites"
        @removeFromFavorites="removeFromFavorites"
      ></ProductCarousel>
    </section>
  </main>
  <Toast ref="toast" />
  <Footer></Footer>
  <add-cart-modal
    v-if="isAddCartModalVisible"
    :product-info="selectedProduct"
    @addToCart="addToCart"
    @hideAddToCartModal="hideAddToCartModal"
  ></add-cart-modal>
</template>

<script>
import Header from '@/components/Header.vue'
import AddCartModal from '@/components/AddCartModal.vue'
import Footer from '@/components/Footer.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import CartContainer from '@/components/CartContainer.vue'
import MenuMobile from '@/components/MenuMobile.vue'
import Toast from '@/components/Toast.vue'

import AppDB from '@/utils/appIndexedDB.js'
import { getData } from '@/utils/CacheService.js'
import {isMobile} from '@/utils/breakPointsHelper.js'

import promotedProductBanner from '@/assets/img/banners/promoted_product_banner.jpg'

export default {
  components: {
    Header,
    AddCartModal,
    Footer,
    ProductCarousel,
    CartContainer,
    MenuMobile,
    Toast
  },
  data() {
    return {
      cartItems: this.$route.params.cart_items,
      favoriteItems: this.$route.params.favorite_items,
      isAddingProductToCart: false,
      promotedProduct: {
        id: 0,
        title: '',
        price: 0,
        description: '',
        image: '',
        category: ''
      },
      products: [],
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      appName: import.meta.env.VITE_APP_NAME,
      selectedProduct: {},
      isCartVisible: false,
      isMobileMenuActive: false,
      isAddCartModalVisible: false,
      isWaitingProductsFetch: false,
      promotedProductBanner
    }
  },

  computed: {
    favoriteProducts() {
      return this.products.filter(product => product.is_favorite)
    },

    relatedProducts() {
      return this.products.filter(product => (product.category === this.promotedProduct.category && product.id !== this.promotedProduct.id))
    },

    mostBoughtProducts() {
      const sortedProducts = this.products.toSorted((a, b) => b.rating.count - a.rating.count)

      if (sortedProducts && sortedProducts.length) {
        return sortedProducts.slice(0, 4)
      }

      return []
    },

    bestRatedProducts() {
      const sortedProducts = this.products.toSorted((a, b) => b.rating.rate - a.rating.rate)

      if (sortedProducts && sortedProducts.length) {
        return sortedProducts.slice(0, 4)
      }

      return []
    },
  },

  methods: {
    async updateCart() {
      await AppDB.updateAppDB(this.cartItems, 'user_store', 'cart_items')
    },

    goToCart() {
      this.$router.push({ name: 'cart', params: { cartItems: this.cartItems } })
    },

    addToCart(product) {
      this.isAddingProductToCart = true

      const alredyOnCart = this.cartItems.find(item => product.id === item.id)

      if (alredyOnCart) {
        alredyOnCart.quantity += product.quantity
      } else {
        const item = this.products.find(item => item.id === product.id)
        item.quantity = product.quantity
        this.cartItems.push(item)
      }

      this.hideAddToCartModal()

      this.updateCart()

      this.$refs.toast.show({
        toast_type: 'success',
        toast_title: 'Adicionado ao carrinho',
        message: `${product.title}. ${product.quantity} unidade${product.quantity > 1 ? 's' : ''}.`
      })

      if (!isMobile()) {
        this.showCart()
      }
    },

    async fetchProducts() {
      this.isWaitingProductsFetch = true

      this.products = []

      const pathname = 'products'
      try {
        const url = new URL(pathname, this.apiBaseUrl)

        const response = await getData(this.appName, url)

        this.products = await response.json().then(products => products.map(product => ({...product, is_favorite: this.isFavorite(product.id)})))

      } catch (error) {
        console.log('error', error)
        console.error('Erro ao buscar produtos')
      } finally {
        this.isWaitingProductsFetch = false
      }
    },

    isFavorite(productId) {
      return this.favoriteItems.some(item => item.id === productId)
    },

    showAddToCartModal(product) {
      this.isAddCartModalVisible = true
      this.selectedProduct = product
    },

    hideAddToCartModal() {
      this.isAddCartModalVisible = false
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

  async created() {
    await this.fetchProducts()
    this.promotedProduct = this.products.find(product => product.id === 14)
  }
}
</script>

<style lang="scss">
.promoted-product-section {
  width: 100vw;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
