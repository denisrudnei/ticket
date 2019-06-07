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
  downloadInfo: async function({ commit }) {
    await this.$axios.get('/status').then(response => {
      commit('status/setStatus', response.data)
    })
    await this.$axios.get('/category').then(response => {
      commit('category/setCategories', response.data)
    })
    await this.$axios.get('/group').then(response => {
      commit('group/setGroups', response.data)
    })
    await this.$axios.get('/analyst').then(reponse => {
      commit('analyst/setAnalysts', reponse.data)
    })
  }
}
