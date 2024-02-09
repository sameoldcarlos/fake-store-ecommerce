import { getCssVariable } from "@/utils/cssVars"

export default {
  data () {
    return {
      searchParam: '',
      strokeColor: getCssVariable('highlight-dark')
    }
  },

  methods: { 
    submit() {
      this.$emit('searchFor', this.searchParam)
    }
  }
}