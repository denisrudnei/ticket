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
  mergeUser(state, user) {
    state.user = user
  },
  updateName(state, name) {
    state.user.name = name
  },
  setColor(state, color) {
    state.user.color = color
  },
  SET(state, value) {}
}
