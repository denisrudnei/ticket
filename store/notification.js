export const state = () => ({
  notifications: [],
  unread: [],
  read: []
})

export const getters = {
  getNotifications(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return state.notifications.filter(notification => {
      return notification.to.map(t => t._id).includes(user._id)
    })
  },
  getUnread(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return getters.getNotifications.filter(notification => {
      return !notification.read.includes(user._id)
    })
  },
  getRead(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return getters.getNotifications.filter(notification => {
      return notification.read.includes(user._id)
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
    state.notifications = [
      ...state.notifications.filter(n => {
        return n._id !== notification._id
      }),
      notification
    ]
  }
}
