export default {
  data () {
    return {
      searchParam: ''
    }
  },

  methods: { 
    submit() {
      this.$emit('searchFor', this.searchParam)
    }
  }
}