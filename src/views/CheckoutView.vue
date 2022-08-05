<script setup lang="ts">
import Cart from '@/components/Cart.vue'
</script>

<template>
  <header class="checkout-header">
    <h5>
      <router-link
        :to="{ name: 'home', params: { cart_items: $route.params ? $route.params.cart_items : '[]' } }"
      >
        <img src="@/assets/img/chevron_down.svg" alt="Voltar" class="back">
      </router-link>
      Meu Carrinho
    </h5>
  </header>
  <main class="checkout">
    <cart />
  </main>
</template>

<style lang="scss">
  .checkout-header {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    background-color: var(--secondary-bg-color);
    padding: 20px 10px;

    h5 {
      margin: 0;

      a {
        margin-right: 10px;        

        .back {
          transform: rotate(90deg);
        }
      }
    }
  }
  .checkout {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1440px;
    min-height: 100vh;
    align-items: center;
    background-color: var(--secondary-bg-color);
    padding: 43px 0;
    margin: 0 auto;
  }
</style>
