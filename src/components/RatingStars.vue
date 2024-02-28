<template>
  <div>
    <div class="d-flex gap-3 rating-stars" :title="rating">
      <p class="mb-0" v-if="showAdditionalInfo">{{ rating }}</p>
      <svg class="svg-model" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="size" :height="size">
        <symbol viewBox="0 0 126.729 126.73" id="star" xmlns="http://www.w3.org/2000/svg">
          <path d="M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z"/>
        </symbol>
      </svg>
      <div class="stars-container d-flex gap-3">
        <div v-for="star in fullFilledStarsCount">
          <svg class="svg-icon app-icon-star" :width="size" :height="size">
            <defs><mask id="mstar"><use fill="white" xlink:href="#star"></use></mask></defs>
            <rect :fill="fillColor" width="100%" height="100%" mask="url(#mstar)"/>
            <use xlink:href="#star" stroke-width="6" stroke="#333" fill="none"></use>
          </svg>
        </div>
        <div v-if="hasPartiallyFilledStar">
          <svg class="svg-icon app-icon-star" :width="size" :height="size">
            <defs><mask id="mstar"><use fill="white" xlink:href="#star"></use></mask></defs>
            <rect :fill="fillColor" :width="`${fillPercentage}%`" height="100%" mask="url(#mstar)"/>
            <use xlink:href="#star" stroke-width="6" stroke="#333" fill="none"></use>
          </svg>
        </div>
        <div v-for="star in emptyStarsCount">
          <svg class="svg-icon app-icon-star" :width="size" :height="size">
            <defs><mask id="mstar"><use fill="white" xlink:href="#star"></use></mask></defs>
            <rect :fill="fillColor" width="0%" height="100%" mask="url(#mstar)"/>
            <use xlink:href="#star" stroke-width="6" stroke="#333" fill="none"></use>
          </svg>
        </div>
      </div>
    </div>
    <p v-if="showAdditionalInfo">({{ count }} avaliações)</p>
  </div>
</template>

<script>
import { getCssVariable } from '@/utils/cssVars.js'

const totalStars = 5

export default {
  props: {
    rating: {
      type: Number,
      required: true
    },

    size: {
      type: String,
      default: "20"
    },

    count: {
      type: Number,
      required: true
    },

    showAdditionalInfo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      fillColor: getCssVariable('rating-stars'),
      emptyColor: getCssVariable('lowlight'),
      strokeColor: getCssVariable('rating-stars-dark'),
      fillPercentage: 0,
    }
  },

  computed: {
    fullFilledStarsCount() {
      if (!this.rating) {
        return 0
      }

      if (this.rating < totalStars) {
        const mod = Math.floor(this.rating%totalStars)

        return mod
      }

      return totalStars
    },

    hasPartiallyFilledStar() {
      this.fillPercentage = Math.ceil((this.rating - this.fullFilledStarsCount) * 100)

      return !!(this.fillPercentage)
    },

    emptyStarsCount() {
      return totalStars - (this.fullFilledStarsCount + Number(this.hasPartiallyFilledStar))
    },

    emptyPercentage() {
      const value = Math.floor(100 - this.fillPercentage)

      return value
    },
  }
}
</script>

<style scoped lang="scss">
  .stars-container{
    text-align: center;
    display: flex;
    margin: 0;
  }
  .svg-icon{
    display: inline-block;
    vertical-align: middle;
    font-size: 100px;
    line-height: 0;
  }

  .svg-model {
    position: absolute;
    left: 0;
    margin: 0
  }

  p {
    font-size: 16px;
  }
</style>
