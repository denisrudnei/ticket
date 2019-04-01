export const state = () => ({
  chats: [],
  active: '',
  visible: false
})

export const getters = {
  getMessages(state) {
    const index = state.chats.findIndex(c => {
      return c.id === state.active
    })

    if (index === -1) return []

    return state.chats[index].messages
  },
  getActive(state) {
    return state.chats.find(c => {
      return c.id === state.active
    })
  },
  getVisible(state) {
    return state.visible
  }
}

export const mutations = {
  createChat(state, analyst) {
    state.chats = [
      ...state.chats.filter(c => {
        return c.id !== analyst._id
      }),
      {
        id: analyst._id,
        to: analyst,
        messages: []
      }
    ]
  },
  deleteChat(state, id) {
    state.chats = [
      ...state.chats.filter(c => {
        return c.id !== id
      })
    ]
  },
  updateChat(state, chat) {
    state.chats = [
      ...state.chats.filter(c => {
        return c.id !== chat.id
      }),
      chat
    ]
  },
  addMessage(state, message) {
    state.chats[message.chatId].messages.push(message)
  },
  setVisible(state, visible) {
    state.visible = visible
  },
  setActive(state, id) {
    state.active = id
  }
}
