export const state = () => ({
  text: '',
  show: false
})

export const getters = {
  getText(state) {
    return state.text
  },
  getShow(state) {
    return state.show
  }
}

export const mutations = {
  setText(state, text) {
    state.text = text
  },
  setShow(state, show) {
    state.show = show
  }
}
