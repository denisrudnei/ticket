import Vue from 'vue'

Vue.filter('date', value => {
  return new Date(value).toLocaleString()
})
