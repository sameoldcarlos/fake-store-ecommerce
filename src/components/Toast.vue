<template>
  <div
    id="feedback-toast-container"
    :class="['feedback-toast-container', {'feedback-toast-container--visible': isVisible}]"
  >
    <div :class="`feedback-toast feedback-toast--${type} d-flex gap-2`">
      <div class="feedback-toast__icon">
        <vue-feather size="32" :type="toastIcon" :stroke="strokeColor" stroke-width="3"></vue-feather>
      </div>
      <div class="feedback-toast__content">
        <span>{{ toastTitle }}</span>
        <p> {{ message }} </p>
      </div>
      <button class="feedback-toast__close btn btn-icon-only p-0" @click="hide">
        <vue-feather size="16" type="x" :stroke="strokeColor" stroke-width="3"></vue-feather>
      </button>
      <div class="feedback-toast__duration">
        <div class="feedback-toast__elapsed" :style="`width: ${remainingWidth}%`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCssVariable } from '@/utils/cssVars'

export default {
  props: {
    type: {
      type: String,
      validator(value) {
        return ['info', 'success', 'danger'].includes(value)
      },
      default: 'info'
    },

    duration: {
      type: Number,
      default: 3000
    },

    message: {
      type: String,
      required: true
    },

    toastTitle: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isVisible: false,

      strokes: {
        info: getCssVariable('highlight-light'),
        danger: getCssVariable('danger-dark'),
        success: getCssVariable('success-dark')
      },

      icons: {
        info: 'info',
        danger: 'x',
        success: 'check'
      },

      remainingWidth: 0
    }
  },

  computed: {
    strokeColor() {
      return this.strokes[this.type]
    },

    toastIcon() {
      return this.icons[this.type]
    },

    durationWidth() {
      return this.duration
    }
  },

  methods: {
    show() {
      this.isVisible = true

      this.startCountdown()
    },

    hide() {
      this.isVisible = false
    },

    startCountdown() {
      const totalWidth = 100
      const timeInterval = 10
      const decreaseAmount = totalWidth * timeInterval/this.duration

      this.remainingWidth = totalWidth

      const intervalId = setInterval(() => {
        if (this.remainingWidth < decreaseAmount) {
          this.remainingWidth = 0
          clearInterval(intervalId)
          this.hide()

          return
        }

        this.remainingWidth -= decreaseAmount
      }, timeInterval)
    }
  }
}
</script>

<style scoped lang="scss">
  .feedback-toast-container {
    position: fixed;
    bottom: 24px;
    left: 0;
    z-index: 11;
    transform: translateY(300%);
    opacity: 0;
    transition: all .5s ease-in-out;

    &--visible {
      transform: translateX(0);
      opacity: 1;
    }

    @media(min-width: 992px) {
      left: 24px;
    }

    .feedback-toast {
      width: auto;
      max-width: 100%;
      border-radius: 8px;
      padding: 8px;
      background-color: var(--primary-bg-color);
      position: relative;
      box-sizing: border-box;
      overflow-x: hidden;

      @media(min-width: 992px) {
        width: 384px;
        max-width: none;
      }

      &--info {
        color: var(--highlight-dark);
        background-color: var(--highlight-lightest);

        span {
          color: var(--highlight-light);
        }

        .feedback-toast__duration {
          background-color: var(--highlight-lighter);
        }


        .feedback-toast__elapsed {
          background-color: var(--highlight-light);
        }
      }

      &--success {
        color: var(--success-dark);
        background-color: var(--success-lighter);

        span {
          color: var(--success-dark);
        }

        .feedback-toast__duration {
          background-color: var(--success-light);
        }


        .feedback-toast__elapsed {
          background-color: var(--success-dark);
        }
      }

      &--danger {
        color: var(--danger-dark);
        background-color: var(--danger-lighter);

        span {
          color: var(--danger-dark);
        }

        .feedback-toast__duration {
          background-color: var(--danger-light);
        }


        .feedback-toast__elapsed {
          background-color: var(--danger-dark);
        }
      }

      &__close {
        margin-right: 0;
        margin-left: auto;
        color: var(--highlight-dark);
        font-weight: 700;
        height: 16px;

        &:hover {
          border: none;
        }
      }

      &__content {
        span {
          font-weight: 700;
        }

        p {
          font-size: 12px;
        }
      }

      &__duration {
        height: 4px;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      &__elapsed {
        height: 100%;
      }
    }
  }
</style>
