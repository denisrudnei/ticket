export const state = () => ({
  notifications: [],
  unread: [],
  read: []
})

export const getters = {
  getNotifications(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return state.notifications
      .filter(notification => {
        return notification.to.map(t => t.id).includes(user.id)
      })
      .sort((ntf1, ntf2) => {
        if (ntf1.date === ntf2.date) return 0
        return ntf1 > ntf2 ? 1 : -1
      })
  },
  getUnread(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return getters.getNotifications.filter(notification => {
      return !notification.read.map(r => r.id).includes(user.id)
    })
  },
  getRead(state, getters, rootState, rootGetters) {
    const user = rootGetters['auth/getUser']
    return getters.getNotifications.filter(notification => {
      return notification.read.map(r => r.id).includes(user.id)
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
        return n.id !== notification.id
      }),
      notification
    ]
  }
}
