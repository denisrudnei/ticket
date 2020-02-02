export const state = () => ({
  group: [],
  status: [],
  openedBy: []
})

export const getters = {
  getGroups(state) {
    return state.groups
  },
  getStatus(state) {
    return state.status
  },
  getOpenedBy(state) {
    return state.openedBy
  },
  getBase(state) {
    return state
  }
}

export const mutations = {
  setGroups(state, groups) {
    state.group = groups
  },
  addGroup(state, group) {
    state.group.push(group)
  },
  setStatus(state, status) {
    state.status = status
  },
  addStatus(state, status) {
    state.status.push(status)
  },
  setOpenedBy(state, openedBy) {
    state.openedBy = openedBy
  },
  addOpenedBy(state, openedBy) {
    state.openedBy.push(openedBy)
  }
}
