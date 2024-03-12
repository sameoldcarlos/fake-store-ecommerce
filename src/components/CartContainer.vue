<template>
  <aside :class="['cart-container', {'cart-container--visible': isVisible}]">
    <button
      class="cart-container__hide-button btn btn-icon-only"
      @click="hideCart"
    >
      <vue-feather type="chevron-right"></vue-feather>
    </button>
    <Cart class="cart--aside"></Cart>
  </aside>
</template>
<script>
  import Cart from "@/components/Cart.vue"

  export default {
    components: { Cart },

    props: {
      isVisible: {
        type: Boolean,
        required: true
      }
    },

    methods: {
      showCart() {
        this.$emit('showCart', true)
      },

      hideCart() {
        this.$emit('hideCart', false)
      },

      toggleCartVisibility() {
        this.$emit('showCart', this.isVisible)
      },
    }
  }
</script>
<style lang="scss">
.cart-container {
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
  transition: all .5s ease;
  border: 1px solid var(--input-border-color);
  background-color: var(--primary-bg-color);
  border-radius: 8px;
  transform: translateX(120%);

  &--visible {
    transform: translateX(0);
  }

  .cart {
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    &__items {
      overflow-y: scroll;
      height: auto;
      max-height: 600px;;
    }

    .payment-details {
      align-self: flex-end;
    }
  }

  &__hide-button {
    width: 48px;
    height: 48px;
    border: 1px solid var(--input-border-color);
    border-radius: 50%;
    margin-left: -24px;
    background-color: var(--primary-bg-color);
    margin-top: 12px;
    z-index: 1;
    position: absolute;

    &:hover {
      background-color: var(--primary-bg-color);
      opacity: .7;
    }
  }
}
</style>
