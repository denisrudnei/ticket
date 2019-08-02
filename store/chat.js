export const state = () => ({
  chats: {},
  active: '',
  visible: false
})

export const getters = {
  getChats(state) {
    return state.chats
  },
  getMessages(state) {
    return state.chats[state.active] === undefined
      ? []
      : state.chats[state.active].messages
  },
  getActive(state) {
    return state.chats[state.active]
  },
  getVisible(state) {
    return state.visible
  }
}

export const mutations = {
  deleteChat(state, id) {
    delete state.chats[id]
  },
  updateChat(state, chat) {
    state.chats[chat.chatId] = chat
  },
  createChat(state, info) {
    state.chats[info.analyst._id] = {
      id: info.analyst._id,
      to: info.analyst,
      messages: info.messages
    }
  },
  receiveMessage(state, message) {
    state.chats[message.chatId].messages.push(message)
  },
  send(state, message) {
    this.$axios.post('/chat/message', message)
  },
  setVisible(state, visible) {
    state.visible = visible
    if (!visible) state.active = ''
  },
  setActive(state, id) {
    state.active = id
  }
}

export const actions = {
  addMessage: ({ commit }, message) => {
    commit('receiveMessage', message)
    commit('send', message)
  },
  getMessages: async function({ commit }, analyst) {
    if (!analyst) return
    let messages = []

    const current = this.getters['auth/getUser']
    if (current !== undefined && current._id !== undefined) {
      await this.$axios.get(`/chat/message/${analyst._id}`).then(response => {
        messages = response.data
      })
      commit('createChat', {
        analyst: analyst,
        messages: messages
      })
    }
  }
}
