/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const getters = {
  getLoggedIn(state) {
    return state.loggedIn;
  },
  getUser(state) {
    return state.user;
  },
};

export const mutations = {
  setUserId(state, id) {
    state.user.id = id;
  },
  setUser(state, user) {
    state.user = user;
  },
  mergeUser(state, user) {
    state.user = user;
  },
  updateName(state, name) {
    state.user.name = name;
  },
  updateEmail(state, contactEmail) {
    state.user.contactEmail = contactEmail;
  },
  updateAddress(state, address) {
    state.user.address = address;
  },
  updateMergePictureWithExternalAccount(state, merge) {
    state.user.mergePictureWithExternalAccount = merge;
  },
  setColor(state, color) {
    state.user.color = color;
  },
  updateImage(state, url) {
    state.user.picture = url;
  },
  removeImage(state) {
    state.user.picture = '/user.svg';
  },
};
