/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import getOneChat from '@/graphql/query/chat/getOneChat';
import sendMessage from '~/graphql/mutation/chat/sendMessage.ts';

export const state = () => ({
  chats: [],
  active: '',
  visible: false,
  messages: [],
  colors: [],
});

export const getters = {
  getChats(state) {
    return state.chats;
  },
  getMessages(state) {
    return state.messages;
  },
  getActive(state) {
    return state.chats.find((chat) => chat.id === state.active);
  },
  getVisible(state) {
    return state.visible;
  },
  getColors(state) {
    return state.colors;
  },
};

export const mutations = {
  deleteChat(state, id) {
    state.chats = state.chats.filter((chat) => chat.id !== id);
  },
  updateChat(state, chat) {
    state.chats = [
      chat,
      ...state.chats.filter((c) => c.chatId !== chat.id),
    ];
  },
  setChats(state, chats) {
    state.chats = chats;
  },
  addChat(state, chat) {
    state.chats.push(chat);
  },
  createChat(state, info) {
    const chat = {
      id: info.analyst.id,
      to: info.analyst,
      messages: info.messages,
    };
    state.chats = [
      chat,
      ...state.chats.filter((c) => c.id !== chat.id),
    ];
  },
  addMessage(state, message) {
    state.messages.push(message);
  },
  setVisible(state, visible) {
    state.visible = visible;
    if (!visible) state.active = '';
  },
  setActive(state, id) {
    state.active = id;
  },
  setMessages(state, messages) {
    state.messages = messages;
  },
  setColors(state, colors) {
    state.colors = colors;
  },
};

export const actions = {
  async getOneChat({ commit }, to) {
    await this.app.$apollo
      .query({
        query: getOneChat,
        variables: {
          to,
        },
      })
      .then((response) => {
        commit('addChat', response.data.chat);
        commit('setActive', response.data.chat.id);
        commit('setMessages', response.data.chat.messages);
        commit('setVisible', response.data.chat.id);
      });
  },
  send({ commit }, message) {
    this.app.$apollo
      .mutate({
        mutation: sendMessage,
        variables: {
          to: message.to,
          message: message.content,
        },
      });
  },
};
