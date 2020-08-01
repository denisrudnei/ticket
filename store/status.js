/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  status: [],
});

export const getters = {
  getStatus(state) {
    return state.status;
  },
};

export const mutations = {
  addStatus(state, status) {
    state.status.push(status);
  },
  setStatus(state, status) {
    state.status = status;
  },
};
