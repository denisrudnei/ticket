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
