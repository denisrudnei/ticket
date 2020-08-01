/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  roles: [],
});

export const mutations = {
  setRoles: (state, roles) => {
    state.roles = roles;
  },
};

export const getters = {
  getRoles: (state) => state.roles,
};
