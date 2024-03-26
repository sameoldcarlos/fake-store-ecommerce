<template>
  <div class="rating-bars">
    <div
      class="rating-line d-flex align-items-center gap-2"
      v-for="(rateCount, key) in ratings"
      :key="key"
    >
      <div
        class="rating-bars__bar-continer"
        :title="`${ratingBarsTitle(rateCount)} ${starsLabel[key]}`"
      >
        <div
          class="rating-bars__bar"
          :style="`width: ${getFillPercentage(rateCount)}%;`"
        ></div>
      </div>
      <span>{{ starsLabel[key] }}</span>
    </div>
  </div>
</template>

<script>
import { getCssVariable } from '@/utils/cssVars.js'
import { generateRandomRate } from '@/utils/randomRates.js'

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'

export default {
  props: {
    count: {
      type: Number,
      required: true
    },

    average: {
      type: Number,
      required: true
    }
  },

  inject: ['appTextData'],

  data() {
    return {
      fillColor: getCssVariable('rating-stars'),
      emptyColor: getCssVariable('lowlight'),
      strokeColor: getCssVariable('rating-stars-dark'),
      ratings: generateRandomRate(this.count, this.average)
    }
  },

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    },

    starsLabel() {
      return {
        rated1: `1 ${this.textContent.star}`,
        rated2: `2 ${this.textContent.stars}`,
        rated3: `3 ${this.textContent.stars}`,
        rated4: `4 ${this.textContent.stars}`,
        rated5: `5 ${this.textContent.stars}`,
      }
    }
  },

  methods: {
    getFillPercentage(ratingCount) {
      return (ratingCount * 100) / this.count
    },

    ratingBarsTitle(rateCount) {
      const { textContent: { people_rated, person_rated } } = this
      if (rateCount > 1) {
        return `${rateCount} ${ people_rated }`
      }

      return `1 ${ person_rated }`
    }
  },
}
</script>

<style scoped lang="scss">
  .rating-bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: var(--secondary-font-family), sans-serif;

    @media(min-width: 992px) {
      min-width: 380px;
    }

    &__bar-continer {
      width: 250px;
      height: 12px;
      border: 1px solid var(--lowlight);
      position: relative;
      border-radius: 6px;
    }

    &__bar {
      display: inline-block;
      background-color: var(--rating-stars);
      height: 100%;
      position: absolute;
      left: 0;
      border-radius: 6px;
      padding: 0 8px;
    }

  }
</style>
