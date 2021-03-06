/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import actualTicket from '@/graphql/query/ticket/actualTicket';

export const state = () => ({
  tickets: [],
  confirmCopy: false,
  ticketToCopy: {},
  modalTickets: [],
  search: [],
  dialog: '',
  query: {},
  modalQuery: {},
  tree: [],
  modalList: false,
  actualTicket: {},
  ticketsToEdit: [],
  attributes: {},
  loading: false,
  pagination: {
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: true,
    sortBy: ['id'],
    sortDesc: ['id'],
    totalItems: 0,
    page: 1,
    itemsPerPage: 10,
  },
});

export const getters = {
  getConfirmCopy(state) {
    return state.confirmCopy;
  },
  getTicketToCopy(state) {
    return state.ticketToCopy;
  },
  getTickets(state) {
    return state.tickets;
  },
  getModalTickets(state) {
    return state.modalTickets;
  },
  getQuery(state) {
    return state.query;
  },
  getModalQuery(state) {
    return state.modalQuery;
  },
  getSearch(state) {
    return state.search;
  },
  getTree(state) {
    return state.tree;
  },
  getActualTicket(state) {
    return state.actualTicket;
  },
  getDialog(state) {
    return state.dialog;
  },
  getTicketsToEdit(state) {
    return state.ticketsToEdit;
  },
  getModalList(state) {
    return state.modalList;
  },
  getDefaultValue() {
    return {
      group: {},
      category: {},
      priority: {},
      status: {},
      openedBy: {},
      actualUser: {},
      affectedUser: {},
      address: {},
      slaCount: undefined,
      created: undefined,
      modified: undefined,
    };
  },
  getLoading(state) {
    return state.loading;
  },
  getPagination(state) {
    return state.pagination;
  },
  getAttributes(state) {
    return state.attributes;
  },
};

export const mutations = {
  setConfirmCopy(state, confirmCopy) {
    state.confirmCopy = confirmCopy;
  },
  setTicketToCopy(state, ticket) {
    state.ticketToCopy = ticket;
  },
  setActualTicket(state, ticket) {
    state.actualTicket = ticket;
  },
  resetActualTicket(state) {
    state.actualTicket = {
      group: {},
      category: {},
      priority: {},
      status: {},
      openedBy: {},
      actualUser: {},
      affectedUser: {},
      address: {},
      slaCount: undefined,
      created: undefined,
      modified: undefined,
    };
  },
  setFieldInActualTicket(state, props) {
    const { field, value } = props;
    state.actualTicket[field] = value;
  },
  insertTicket(state, ticket) {
    state.tickets.push(ticket);
  },
  setTickets(state, tickets) {
    state.tickets = tickets;
  },
  setModalTickets(state, tickets) {
    state.modalTickets = tickets;
  },
  setQuery(state, query) {
    state.query = query;
    this.$router.push({
      query,
    });
  },
  addComment(state, comment) {
    if (!Object.prototype.hasOwnProperty.call(state.actualTicket, 'comments')) return;
    state.actualTicket.comments.push(comment);
  },
  setModalQuery(state, modalQuery) {
    state.modalQuery = modalQuery;
  },
  updateTicket(state, ticket) {
    if (Object.prototype.hasOwnProperty.call(state.actualTicket, 'id')) {
      if (state.actualTicket.id === ticket.id) {
        state.actualTicket = ticket;
      }
    }
    const index = state.tickets.findIndex((t) => t.id === ticket.id);

    if (index !== -1) {
      Object.assign(state.tickets[index], ticket);
    } else {
      state.tickets.push(ticket);
    }
    const searchIndex = state.modalTickets.findIndex((s) => s.id === ticket.id);
    if (searchIndex !== -1) {
      Object.assign(state.modalTickets[searchIndex], ticket);
    } else {
      state.modalTickets.push(ticket);
    }
  },
  setTree(state, tree) {
    state.tree = tree;
  },
  addTreeItem(state, item) {
    state.tree = [
      item,
      ...state.tree.filter((i) => i.id !== item.id),
    ];
  },
  removeTreeItem(state, id) {
    state.tree = state.tree.filter((item) => item.id !== id);
  },
  setDialog(state, ticketId) {
    state.dialog = ticketId;
  },
  setSearch(state, tickets) {
    state.search = tickets;
  },
  removeFromEdit(state, id) {
    state.ticketsToEdit = state.ticketsToEdit.filter((ticket) => ticket.id !== id);
  },
  addTicketsToEdit(state, ticket) {
    state.ticketsToEdit = [
      ...state.ticketsToEdit.filter((t) => t.id !== ticket.id),
      ticket,
    ];
  },
  setModalList(state, modalList) {
    state.modalList = modalList;
  },
  setChildren(state, children) {
    state.actualTicket.children = children;
  },
  addChildren(state, children) {
    state.actualTicket.children = state.actualTicket.children.concat(children);
  },
  removeChildren(state, children) {
    state.actualTicket.children = state.actualTicket.children.filter((c) => c.id !== children.id);
  },
  setLoading(state, loading) {
    state.loading = loading;
  },
  setPagination(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },
  setPage(state, page) {
    state.pagination.page = parseInt(page, 10);
  },
  setAttributes(state, attributes) {
    state.attributes = attributes;
  },
};

export const actions = {
  insertTicket({ commit }, ticket) {
    commit('insertTicket', ticket);
  },
  updateSla({ commit, state }, ticket) {
    if (Object.prototype.hasOwnProperty.call(state.actualTicket, 'id')) {
      if (state.actualTicket.id === ticket.id) {
        commit('setFieldInActualTicket', {
          field: 'slaCount',
          value: ticket.slaCount,
        });
      }
    }
  },
  async findTicket({ commit }, id) {
    const { data } = await this.app.apolloProvider.defaultClient
      .query({
        query: actualTicket,
        variables: {
          id,
        },
      });
    commit('setActualTicket', data.TicketById);
  },
  async updateTree({ commit }) {
    await this.$axios.get('/info/path').then((response) => {
      commit('setTree', response.data);
    });
  },
};
