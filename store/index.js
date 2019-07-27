export const state = () => ({
  message: '',
  show: false
})

export const mutations = {
  showMessage(state, message) {
    state.message = message
    state.show = true
  }
}

export const actions = {
  downloadInfo: function({ commit }) {
    this.$axios.get('/status').then(response => {
      commit('status/setStatus', response.data)
    })
    this.$axios.get('/category').then(response => {
      commit('category/setCategories', response.data)
    })
    this.$axios.get('/group').then(response => {
      commit('group/setGroups', response.data)
    })
    this.$axios.get('/analyst').then(reponse => {
      commit('analyst/setAnalysts', reponse.data)
    })
  }
}
