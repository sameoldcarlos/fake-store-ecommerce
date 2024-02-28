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
      total: this.products.length,
      screenWidth: window.innerWidth,
      deviceType: getDeviceType()
    }
  },

  computed: {
    perPage() {
      const {deviceType} = this

      if (deviceType ===  devices.mobile) {
        return 1
      }

      if (deviceType ===  devices.highResMobile) {
        return 2
      }

      if (deviceType === devices.tablet) {
        return 3
      }

      if (deviceType === devices.lowResDesktop) {
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
      return (16 * (this.total - 1) + (180 * this.total) + 8)
    },

    displayWidth() {
      if (this.total > this.perPage) {
        return (16 * (this.perPage - 1) + this.perPage * 180 + 40)
      }

      return this.carouselWidth
    },

    translate() {
      return -(180 + 16) * (this.currentPage - 1);
    },

    showControllers() {
      this.currentPage = 1

      return this.total > this.perPage
    }
  },

  methods: {
    swipeNext() {
      this.currentPage++
    },

    swipePrevious() {
      this.currentPage--
    },

    getDeviceType() {
      this.deviceType = getDeviceType()
    }
  },

  mounted() {
    window.addEventListener('resize', () => {
      this.getDeviceType()
    })
  }
}