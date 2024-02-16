const currentDate = new Date()

export default {
  data() {
    return {
      currentYear: currentDate.getFullYear(),
      currentTime: currentDate
    }
  }
}