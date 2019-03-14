export const state = () => ({
  analysts: [],
  current: null
})

export const getters = {
  logged(state) {
    return state.current !== null
  }
}

export const mutations = {
  insert(state, analyst) {
    state.analysts.push(analyst)
  },
  login(state, analyst) {
    state.current = analyst
  }
}
