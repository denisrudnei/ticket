/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  logout: false,
});

export const getters = {
  getLogout(state) {
    return state.logout;
  },
};

export const mutations = {
  setLogout(state, value) {
    state.logout = value;
  },
};
