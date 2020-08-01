/* eslint-disable no-shadow */
export const state = () => ({
  ticketsToEdit: [],
});

export const getters = {
  getTicketsToEdit(state) {
    return state.ticketsToEdit;
  },
};

export const mutations = {
  addNotification(state, { notification, rootGetters }) {
    if (
      rootGetters['ticket/getTicketsToEdit']
        .map((t) => t.id)
        .includes(notification.ticket)
    ) {
      state.ticketsToEdit = [
        notification,
        ...state.ticketsToEdit.filter((ntf) => ntf.ticket !== notification.ticket),
      ];
    }
  },
  removeNotification(state, ticketId) {
    state.ticketsToEdit = state.ticketsToEdit.filter(
      (notification) => notification.ticket !== ticketId,
    );
  },
};

export const actions = {
  notify({ commit, rootGetters }, notification) {
    commit('addNotification', {
      notification,
      rootGetters,
    });
  },
};
