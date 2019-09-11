export const state = () => ({
  ticketsToEdit: []
})

export const getters = {
  getTicketsToEdit(state) {
    return state.ticketsToEdit
  }
}

export const mutations = {
  addNotification(state, { notification, rootGetters }) {
    if (
      rootGetters['ticket/getTicketsToEdit']
        .map(t => t._id)
        .includes(notification.ticket)
    ) {
      state.ticketsToEdit = [
        notification,
        ...state.ticketsToEdit.filter(ntf => {
          return ntf.ticket !== notification.ticket
        })
      ]
    }
  },
  removeNotification(state, ticketId) {
    state.ticketsToEdit = state.ticketsToEdit.filter(notification => {
      return notification.ticket !== ticketId
    })
  }
}

export const actions = {
  notify({ commit, rootGetters }, notification) {
    commit('addNotification', {
      notification,
      rootGetters
    })
  }
}
