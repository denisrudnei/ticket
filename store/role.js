export const state = () => ({
  roles: []
})

export const mutations = {
  setRoles: (state, roles) => {
    state.roles = roles
  }
}

export const getters = {
  getRoles: state => {
    return state.roles
  }
}

export const actions = {
  downloadRoles: function({ commit }) {
    this.$axios.get('/role').then(response => {
      commit('setRoles', response.data)
    })
  }
}
