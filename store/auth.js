export const getters = {
  getLoggedIn(state) {
    return state.loggedIn
  },
  getUser(state) {
    return state.user
  }
}

export const mutations = {
  setUserId(state, id) {
    state.user._id = id
  },
  SET(state, value) {}
}
