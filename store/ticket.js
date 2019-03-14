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
  }
}

export const actions = {
  insertTicket({ commit }, ticket) {
    commit('insertTicket', ticket)
  }
}
