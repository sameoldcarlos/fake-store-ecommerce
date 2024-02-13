export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    },

    menuOptions: {
      type: Array,
      required: true
    }
  },

  methods: {
    closeMobileMenu() {
      this.$emit('closeMobileMenu')
    }
  }
}