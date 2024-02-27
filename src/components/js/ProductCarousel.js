import { getDeviceType, devices } from "@/utils/breakPointsHelper.js"

export default {
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      currentPage: 1,
      lastPage: this.products.length,
      firstPage: 1
    }
  },

  computed: {
    perPage() {
      const deviceType = getDeviceType();

      if (deviceType ===  devices.mobile) {
        return 1
      }

      if (deviceType === devices.tablet) {
        return 3
      }

      return 5
    },

    canPageNext() {
      return this.currentPage < this.lastPage
    },
    
    canPagePrevious() {
      return this.currentPage >= this.firstPage
    }
  },

  methods: {
    swipeNext() {
      this.currentPage++
    },

    swipePrevious() {
      this.currentPage--
    }
  }
}