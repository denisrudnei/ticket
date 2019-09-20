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
const query = `query {
  Status {
    _id
    name
    allowedStatus {
      _id
      name
    }
  }
  Group {
    _id
    name
  }
  Category {
    _id
    name
    fullName
  }
  Analyst {
    name
  }
}`
export const actions = {
  downloadInfo: function({ commit }) {
    this.$axios
      .post('/graphql', {
        query
      })
      .then(response => {
        commit('status/setStatus', response.data.data.Status)
        commit('category/setCategories', response.data.data.Category)
        commit('group/setGroups', response.data.data.Group)
        commit('analyst/setAnalysts', response.data.data.Analyst)
      })
  }
}
