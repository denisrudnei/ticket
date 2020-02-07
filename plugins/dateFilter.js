import Vue from 'vue'

Vue.filter('date', value => {
  return new Date(value).toLocaleString()
})

Vue.filter('datetime', value => {
  const date = new Date(value)
  return `${date.toLocaleString()} ${date.toLocaleTimeString()}`
})
