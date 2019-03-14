export const state = () => ({
  groups: []
})

export const getters = {
  getGroups(state) {
    return state.groups
  }
}

export const mutations = {
  setGroups(state, groups) {
    state.groups = groups
  },
  addGroup(state, group) {
    state.groups.push(group)
  }
}
