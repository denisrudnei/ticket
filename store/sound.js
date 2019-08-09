export const state = () => ({
  chat: {
    volume: 0,
    muted: 0
  },
  notification: 0,
  muted: 0
})

export const getters = {
  getChatVolume(state) {
    return state.chat.volume
  },
  getNotificationVolume(state) {
    return state.notification.volume
  }
}

export const mutations = {
  setChatVolume(state, volume) {
    state.chat.volume = volume
  },
  setNotificationVolume(state, volume) {
    state.notification.volume = volume
  }
}
