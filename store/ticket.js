import _ from 'lodash'

export const state = () => ({
  tickets: [],
  search: [],
  dialog: '',
  actualTicket: {},
  info: [
    {
      name: 'Status',
      group: 'status.name'
    },
    {
      name: 'Grupo',
      group: 'group.name'
    },
    {
      name: 'Categoria',
      group: 'category.name'
    }
  ],
  ticketsToEdit: []
})

export const getters = {
  getTickets(state) {
    return state.tickets
  },
  getSearch(state) {
    return state.search
  },
  getTree(state) {
    return state.info.map(leaf => {
      const base = _(state.tickets)
        .groupBy(leaf.group)
        .value()

      const result = Object.keys(base).map(k => ({
        id: `(${base[k].length}) ${k}`,
        name: `(${base[k].length}) ${k}`,
        url: `/search?${leaf.group}=${k}`,
        children: []
      }))
      return {
        id: leaf.group,
        name: leaf.name,
        children: result
      }
    })
  },
  getActualTicket(state) {
    return state.actualTicket
  },
  getDialog(state) {
    return state.dialog
  },
  getTicketsToEdit(state) {
    return state.ticketsToEdit
  }
}

export const mutations = {
  setActualTicket(state, ticket) {
    state.actualTicket = state.tickets.find(t => {
      return t._id === ticket._id
    })
  },
  insertTicket(state, ticket) {
    state.tickets.push(ticket)
  },
  setTickets(state, tickets) {
    state.tickets = tickets
  },
  updateTicket(state, ticket) {
    if (state.actualTicket.hasOwnProperty('_id')) {
      if (state.actualTicket._id === ticket._id) {
        state.actualTicket = ticket
      }
    }
    state.tickets = [
      ...state.tickets.filter(t => {
        return t._id !== ticket._id
      }),
      ticket
    ]
    const tickets = state.search.filter(s => {
      return s._id === ticket._id
    })
    if (tickets.length > 0) {
      state.search = [
        ...state.search.filter(s => {
          return s._id !== ticket._id
        }),
        ticket
      ]
    }
  },
  setDialog(state, ticketId) {
    state.dialog = ticketId
  },
  setSearch(state, tickets) {
    state.search = tickets
  },
  addTicketsToEdit(state, ticket) {
    state.ticketsToEdit = [
      ...state.ticketsToEdit.filter(t => {
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
