<template>
  <div class="comments">
    <h3 class="comments__title">{{ textContent.what_customers_say }}</h3>
    <hr>
    <div
      v-for="comment in comments"
      class="comments__comment"
    >
      <RatingStars size="20" :rating="4" />
      <div class="d-flex gap-2 mt-3">
        <div class="comments__profile-pic">
          <img :src="comment.author.image" alt="" width="40" height="40" class="user-image">
        </div>
        <h4 class="comments__customer-name text-capitalize">{{ comment.author.name }}</h4>
      </div>
      <p class="comments__comment-body">
        {{ comment.text }}
      </p>
    </div>
    <hr>
  </div>
</template>

<script>
import RatingStars from "@/components/RatingStars.vue"

import { mapState } from 'pinia'
import { useLanguageStore } from '@/stores/language'



export default {
  components: {
    RatingStars
  },

  props: {
    comments: {
      type: Array,
      required: true
    }
  },

  inject: ['appTextData'],

  computed: {
    ...mapState(useLanguageStore, ['selectedLanguage']),

    textContent() {
      return this.appTextData[this.selectedLanguage]
    }
  }
}

</script>

<style scoped lang="scss">
  .comments {
    &__comment {
      padding: 24px 16px;
    }

    &__title {
      @media(min-width: 992px) {
        height: 64px;
      }
    }

    &__comment-body {
      margin: 16px 0;
    }
  }
</style>
