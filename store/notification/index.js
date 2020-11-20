/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  notifications: [],
  unread: [],
  read: [],
});

export const getters = {
  getNotifications(state, getters, rootState, rootGetters) {
    const user = rootGetters['user/getUser'];
    return state.notifications
      .filter((notification) => notification.to.map((t) => t.id).includes(user.id.toString()))
      .sort((ntf1, ntf2) => {
        if (ntf1.date === ntf2.date) return 0;
        return ntf1.id > ntf2.id ? 1 : -1;
      });
  },
  getUnread(state, getters, rootState, rootGetters) {
    const user = rootGetters['user/getUser'];
    return getters.getNotifications.filter(
      (notification) => !notification.read.map((r) => r.id).includes(user.id.toString()),
    );
  },
  getRead(state, getters, rootState, rootGetters) {
    const user = rootGetters['user/getUser'];
    return getters.getNotifications.filter(
      (notification) => notification.read.map((r) => r.id).includes(user.id.toString()),
    );
  },
};

export const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
  addNotification(state, notification) {
    state.notifications.push(notification);
  },
  updateNotification(state, notification) {
    state.notifications = [
      ...state.notifications.filter((n) => n.id !== notification.id),
      notification,
    ];
  },
};
