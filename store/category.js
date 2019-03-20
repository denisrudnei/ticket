export const state = () => ({
  categories: []
})

export const getters = {
  getCategories(state) {
    return state.categories
  }
}

export const mutations = {
  setCategories(state, categories) {
    state.categories = categories
  }
}
