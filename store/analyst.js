export const state = () => ({
  analysts: []
})

export const mutations = {
  insert(state, analyst) {
    state.analysts.push(analyst)
  }
}
