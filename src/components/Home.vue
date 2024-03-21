<template>
  <div class="home-page">
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
        <div class="promoted-product__info">
          <h1 class="promoted-product__title">Experimente cada pixel</h1>
          <p class="promoted-product__subtitle">Samsung Ultrawide 49”, onde clareza e conforto se encontram</p>
          <div class="action-container d-grid gap-2 mt-lg-4">
            <a
              :href="productLink"
              class="promoted-product__buy btn btn-success btn-full"
            >
              Comprar agora
            </a>
          </div>
        </div>
      </section>
      <div class="home-page__content-container">
        <section class="home-page__section related-products">
          <h2 class="text-center mb-5">Mais da categoria {{ promotedProductCategory }}</h2>
          <ProductCarousel
            v-if="!isWaitingProductsFetch && relatedProducts.length"
              :products="relatedProducts"
              @showAddToCartModal="showAddToCartModal"
              @addToFavorites="addToFavorites"
              @removeFromFavorites="removeFromFavorites"
          ></ProductCarousel>
        </section>
        <hr class="home-page__divider">
        <section class="home-page__section related-products">
          <h2 class="text-center mb-5">Mais vendidos</h2>
          <ProductCarousel
            v-if="!isWaitingProductsFetch && mostBoughtProducts.length"
            :products="mostBoughtProducts"
            @showAddToCartModal="showAddToCartModal"
            @addToFavorites="addToFavorites"
            @removeFromFavorites="removeFromFavorites"
          ></ProductCarousel>
        </section>
        <hr class="home-page__divider">
        <section class="home-page__section related-products">
          <h2 class="text-center mb-5">Melhor avaliados</h2>
          <ProductCarousel
            v-if="!isWaitingProductsFetch && bestRatedProducts.length"
              :products="bestRatedProducts"
              @showAddToCartModal="showAddToCartModal"
              @addToFavorites="addToFavorites"
              @removeFromFavorites="removeFromFavorites"
          ></ProductCarousel>
        </section>
        <hr class="home-page__divider">
        <section class="home-page__section related-products">
          <h2
            v-if="!isWaitingProductsFetch && favoriteProducts.length"
            class="text-center mb-5">Seus Favoritos
          </h2>
          <ProductCarousel
            v-if="!isWaitingProductsFetch && favoriteProducts.length"
            :products="favoriteProducts"
            @showAddToCartModal="showAddToCartModal"
            @addToFavorites="addToFavorites"
            @removeFromFavorites="removeFromFavorites"
          ></ProductCarousel>
        </section>
      </div>
    </main>
    <Toast ref="toast" />
    <Footer></Footer>
    <add-cart-modal
      v-if="isAddCartModalVisible"
      :product-info="selectedProduct"
      @addToCart="addToCart"
      @hideAddToCartModal="hideAddToCartModal"
    ></add-cart-modal>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import AddCartModal from '@/components/AddCartModal.vue'
import Footer from '@/components/Footer.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import CartContainer from '@/components/CartContainer.vue'
import MenuMobile from '@/components/MenuMobile.vue'
import Toast from '@/components/Toast.vue'

import AppDB from '@/utils/appIndexedDb.js'
import { getData } from '@/utils/CacheService.js'
import {isMobile} from '@/utils/breakPointsHelper.js'
import { formattedCategories } from '@/utils/content.js'
import normalizeText from '@/utils/normalizeText.js'

import promotedProductBanner from '@/assets/img/banners/promoted_product_banner.png'

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

    promotedProductCategory() {
      if (!this.promotedProduct.category.length) {
        return ''
      }

      return formattedCategories[this.promotedProduct.category].pt
    },

    productLink() {
      if (!this.promotedProduct.title && !this.promotedProduct.title.length) {
        return ''
      }

      const normalizedTitle = normalizeText(this.promotedProduct.title)

      return `/product/${this.promotedProduct.id}/${normalizedTitle}`
    }
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
.home-page {
  &__section {
    margin: 36px 0 52px 0;
  }

  &__content-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .promoted-product-section {
    display: flex;
    width: 100vw;
    padding: 30px 0;
    align-items: center;
    box-shadow: var(--primary-box-shadow);
    background-image: linear-gradient(rgba(0, 0, 0, 0.5),
                      rgba(0, 0, 0, 0.5)),
                      url('../assets/img/banners/promoted_product_banner.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;

    @media (min-width: 768px) {
      min-height: 320px;
      filter: none;
      background-image: url('../assets/img/banners/promoted_product_banner.png');
    }

    @media (min-width: 992px) {
      min-height: 400px;
    }

    .promoted-product {

      &__info {
        color: white;
        font-size: 32px;
        text-align: center;
        z-index: 2;
        padding: 0 32px;
        width: 100%;
        max-width: 680px;

        @media (min-width: 768px) {
          width: 50%;
          margin-left: 50%;
          padding: 0 24px;
        }
      }

      &__title {
        font-size: 80%;
        font-family: var(--secondary-font-family);
        font-weight: 700;
        width: 100%;

        @media (min-width: 992px) {
          font-size: 100%;
        }
      }

      &__subtitle {
        font-size: 50%;
        font-family: var(--primary-font-family);
        width: 100%;
        font-weight: 400;

        @media (min-width: 992px) {
          font-size: 60%;
        }
      }

      &__buy {
        font-size: 20px;
        font-family: var(--secondary-font-family);
        font-weight: 700;
        min-height: 48px;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }
    }
  }
}
</style>
