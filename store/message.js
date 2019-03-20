export const state = () => ({
  messages: []
})

export const getters = {
  getMessages(state) {
    return state.messages
  }
}

export const mutations = {
  setMessages(state, messages) {
    state.messages = messages
  },
  addMessage(state, message) {
    state.messages.push(message)
  }
}
