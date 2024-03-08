import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProductPage from '@/components/ProductPage.vue'
import CartDB from '@/utils/IndexedDbCart.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async route => { route.params.cart_items = await CartDB.getCartItemsFromDB() }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      beforeEnter: async route => { route.params.cart_items = await CartDB.getCartItemsFromDB() },
      beforeRouteLeave: async route => { await CartDB.updateCartDB(route.params.cart_items) }
    },
    {
      path: '/product/:id/:title',
      name: 'product',
      component: ProductPage,
      beforeEnter: async route => { route.params.cart_items = await CartDB.getCartItemsFromDB() },
      props: route => ({ productId: route.params.id })
    },
    {
      path: '/404',
      name: 'not_found',
      component: NotFoundView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

router.beforeEach(async () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

export default router
