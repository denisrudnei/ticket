export const state = () => ({
  notifications: [],
  unread: []
})

export const getters = {
  getNotifications(state) {
    return state.notifications
  },
  getUnread(state) {
    return state.notifications.filter(n => {
      return n.read === false
    })
  }
}

export const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  addNotification(state, notification) {
    state.notifications.push(notification)
  },
  updateNotification(state, notification) {
    const index = state.notifications.findIndex(n => {
      return n._id === notification._id
    })
    if (index !== -1) {
      state.notifications.splice(index, 1)
      state.notifications.push(notification)
    }
  }
}
