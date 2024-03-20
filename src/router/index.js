import { createRouter, createWebHistory } from 'vue-router'
import CheckoutView from '@/views/CheckoutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import ProductPage from '@/components/ProductPage.vue'
import AppDB from '@/utils/appIndexedDb.js'
import NewHome from '@/components/NewHome.vue'
import Products from '@/components/Products.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewHome,
      beforeRouteLeave: async route => { await AppDB.updateAppDB(route.params.cart_items, 'user_store', 'cart_items') }
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      beforeRouteLeave: async route => { await AppDB.updateAppDB(route.params.cart_items, 'user_store', 'cart_items') }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      beforeRouteLeave: async route => { await AppDB.updateAppDB(route.params.cart_items, 'user_store', 'cart_items') }
    },
    {
      path: '/product/:id/:title',
      name: 'product',
      component: ProductPage,
      props: route => ({ productId: route.params.id }),
      beforeRouteLeave: async route => { await AppDB.updateAppDB(route.params.cart_items, 'user_store', 'cart_items') }
    },
    {
      path: '/products/:category',
      name: 'category-page',
      component: Products,
      beforeRouteLeave: async route => { await AppDB.updateAppDB(route.params.cart_items, 'user_store', 'cart_items') }
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

router.beforeEach(async to => {
  to.params.cart_items = await AppDB.getItemsFromDB('user_store', 'cart_items')
  to.params.favorite_items = await AppDB.getItemsFromDB('user_store', 'favorite_items')
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

export default router
