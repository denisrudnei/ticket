export const state = () => ({
  show: false,
  hotkeys: []
})

export const getters = {
  getShow(state) {
    return state.show
  },
  getHotkeys(state) {
    return state.hotkeys
  }
}

export const mutations = {
  toggleShow(state) {
    state.show = !state.show
  },
  setHotkeys(state, hotkeys) {
    state.hotkeys = hotkeys
  },
  addHotkey(state, hotkey) {
    state.hotkeys.push(hotkey)
  }
}
