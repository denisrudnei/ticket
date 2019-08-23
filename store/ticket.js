export const state = () => ({
  tickets: [],
  modalTickets: [],
  search: [],
  dialog: '',
  query: {},
  modalQuery: {},
  tree: [],
  modalList: false,
  actualTicket: {},
  ticketsToEdit: []
})

export const getters = {
  getTickets(state) {
    return state.tickets
  },
  getModalTickets(state) {
    return state.modalTickets
  },
  getQuery(state) {
    return state.query
  },
  getModalQuery(state) {
    return state.modalQuery
  },
  getSearch(state) {
    return state.search
  },
  getTree(state) {
    return state.tree
  },
  getActualTicket(state) {
    return state.actualTicket
  },
  getDialog(state) {
    return state.dialog
  },
  getTicketsToEdit(state) {
    return state.ticketsToEdit
  },
  getModalList(state) {
    return state.modalList
  }
}

export const mutations = {
  setActualTicket(state, ticket) {
    state.actualTicket = ticket
  },
  insertTicket(state, ticket) {
    state.tickets.push(ticket)
  },
  setTickets(state, tickets) {
    state.tickets = tickets
  },
  setModalTickets(state, tickets) {
    state.modalTickets = tickets
  },
  setQuery: function(state, query) {
    state.query = query
    this.$router.push({
      query: query
    })
  },
  setModalQuery(state, modalQuery) {
    state.modalQuery = modalQuery
  },
  updateTicket(state, ticket) {
    if (Object.prototype.hasOwnProperty.call(state.actualTicket, '_id')) {
      if (state.actualTicket._id === ticket._id) {
        state.actualTicket = ticket
      }
    }
    const index = state.tickets.findIndex(t => {
      return t._id === ticket._id
    })

    if (index !== -1) {
      Object.assign(state.tickets[index], ticket)
    } else {
      state.tickets.push(ticket)
    }
    const searchIndex = state.modalTickets.findIndex(s => {
      return s._id === ticket._id
    })
    if (searchIndex !== -1) {
      Object.assign(state.modalTickets[searchIndex], ticket)
    } else {
      state.modalTickets.push(ticket)
    }
  },
  setTree(state, tree) {
    state.tree = tree
  },
  setDialog(state, ticketId) {
    state.dialog = ticketId
  },
  setSearch(state, tickets) {
    state.search = tickets
  },
  removeFromEdit(state, id) {
    state.ticketsToEdit = state.ticketsToEdit.filter(ticket => {
      return ticket._id !== id
    })
  },
  addTicketsToEdit(state, ticket) {
    state.ticketsToEdit = [
      ...state.ticketsToEdit.filter(t => {
        return t._id !== ticket._id
      }),
      ticket
    ]
  },
  setModalList(state, modalList) {
    state.modalList = modalList
  }
}

export const actions = {
  insertTicket({ commit }, ticket) {
    commit('insertTicket', ticket)
  },
  findTicket: async function({ commit }, id) {
    await this.$axios.get(`/ticket/${id}`).then(response => {
      commit('setActualTicket', response.data)
    })
  },
  updateTree: async function({ commit }) {
    await this.$axios.get('/info/path').then(response => {
      commit('setTree', response.data)
    })
  }
}
