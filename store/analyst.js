export const state = () => ({
  analysts: [],
  current: null
})

export const getters = {
  getAnalysts(state) {
    return state.analysts
  }
}

export const mutations = {
  insert(state, analyst) {
    state.analysts.push(analyst)
  },
  setAnalysts(state, analysts) {
    state.analysts = analysts
  }
}
