import { getDeviceType, devices } from '@/utils/breakPointsHelper.js'
import ProductCard from '@/components/ProductCard.vue'

export default {
  components: {
    ProductCard
  },

  props: {
    products: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      currentPage: 1,
      firstPage: 1,
      total: this.products.length
    }
  },

  computed: {
    getDeviceType,
    perPage() {
      const {getDeviceType} = this

      if (getDeviceType ===  devices.mobile) {
        return 1
      }

      if (getDeviceType === devices.tablet) {
        return 3
      }

      if (getDeviceType === devices.lowResDesktop) {
        return 4
      }

      return 5
    },

    lastPage() {
      return this.total - this.perPage
    },

    canPageNext() {
      return this.currentPage <= this.lastPage
    },
    
    canPagePrevious() {
      return this.currentPage > this.firstPage
    },

    carouselWidth() {
      return (16 * (this.total - 1) + (180 * this.total))
    },

    displayWidth() {
      if (this.total > this.perPage) {
        return (16 * (this.perPage - 1) + this.perPage * 180 + 40)
      }

      return this.carouselWidth
    },

    translate() {
      return -(180 + 16) * (this.currentPage - 1);
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