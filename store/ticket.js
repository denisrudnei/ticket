/* eslint-disable */
import _ from 'lodash'
import { satisfies } from 'semver';

export const state = () => ({
  tickets: [],
  search: [],
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
  ]
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
    if (state.search.filter(s => { return s._id === ticket._id }).length > 0) {
      state.search = [
        ...state.search.filter(s => {
          return s._id !== ticket._id
        }),
        ticket
      ]
    }
  },
  setSearch(state, tickets) {
    state.search = tickets
  }
}

export const actions = {
  insertTicket({ commit }, ticket) {
    commit('insertTicket', ticket)
  }
}
