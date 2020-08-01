/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  groups: [],
});

export const getters = {
  getGroups(state) {
    return state.groups;
  },
};

export const mutations = {
  setGroups(state, groups) {
    state.groups = groups;
  },
  addGroup(state, group) {
    state.groups.push(group);
  },
  removeGroup(state, groupId) {
    state.groups = [
      ...state.groups.filter((group) => group.id !== groupId),
    ];
  },
};
