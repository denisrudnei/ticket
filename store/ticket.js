export const state = () => ({
  tickets: []
})

export const getters = {
  getTickets(state) {
    return state.tickets
  }
}

export const mutations = {
  insertTicket(state, { ticket }) {
    state.tickets.push(ticket)
  },
  setTickets(state, tickets) {
    state.tickets = tickets
  },
  updateTicket(state, ticket) {
    state.tickets = [
      ...state.tickets.filter(t => {
        return t._id !== ticket._id
      }),
      ticket
    ]
  }
}

export const actions = {
  insertTicket({ commit }, ticket) {
    commit('insertTicket', ticket)
  }
}
