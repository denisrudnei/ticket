import ggl from 'graphql-tag'
import getOneChat from '@/graphql/query/chat/getOneChat.graphql'
import sendMessage from '@/graphql/mutation/chat/sendMessage.graphql'
export const state = () => ({
  chats: [],
  active: '',
  visible: false,
  messages: []
})

export const getters = {
  getChats(state) {
    return state.chats
  },
  getMessages(state) {
    return state.messages
  },
  getActive(state) {
    return state.chats.find(chat => {
      return chat.id === state.active
    })
  },
  getVisible(state) {
    return state.visible
  }
}

export const mutations = {
  deleteChat(state, id) {
    state.chats = state.chats.filter(chat => {
      return chat.id !== id
    })
  },
  updateChat(state, chat) {
    state.chats = [
      chat,
      ...state.chats.filter(c => {
        return c.chatId !== chat.id
      })
    ]
  },
  setChats(state, chats) {
    state.chats = chats
  },
  addChat(state, chat) {
    state.chats.push(chat)
  },
  createChat(state, info) {
    const chat = {
      id: info.analyst.id,
      to: info.analyst,
      messages: info.messages
    }
    state.chats = [
      chat,
      ...state.chats.filter(c => {
        return c.id !== chat.id
      })
    ]
  },
  addMessage(state, message) {
    state.messages.push(message)
  },
  setVisible(state, visible) {
    state.visible = visible
    if (!visible) state.active = ''
  },
  setActive: function(state, id) {
    state.active = id
  },
  setMessages(state, messages) {
    state.messages = messages
  }
}

export const actions = {
  getOneChat: async function({ commit }, to) {
    await this.app.$apollo
      .query({
        query: ggl(getOneChat),
        variables: {
          to: to
        }
      })
      .then(response => {
        commit('addChat', response.data.chat)
        commit('setActive', response.data.chat.id)
        commit('setMessages', response.data.chat.messages)
        commit('setVisible', response.data.chat.id)
      })
  },
  send({ commit }, message) {
    this.app.$apollo
      .mutate({
        mutation: ggl(sendMessage),
        variables: {
          to: message.to,
          message: message.content
        }
      })
      .then(response => {
        commit('addMessage', response.data.message)
      })
  }
}
