const TicketService = require('./services/ticket/TicketService')
const AuthService = require('./services/AuthService')
const CategoryService = require('./services/ticket/CategoryService')
const GroupService = require('./services/ticket/GroupService')
const StatusService = require('./services/ticket/StatusService')
const AnalystService = require('./services/AnalystService')
const resolvers = {
  Query: {
    TicketById: (_, { id }) => {
      return TicketService.getOne(id)
    },
    Tickets: (_, { sortBy, descending, page, limit }) => {
      return TicketService.getTickets(
        {},
        {
          [sortBy]: descending
        },
        page,
        limit
      )
    },
    Analyst: () => {
      return AnalystService.getAnalysts()
    },
    Group: () => {
      return GroupService.getAll()
    },
    Category: () => {
      return CategoryService.getCategories()
    },
    Status: () => {
      return StatusService.getStatus()
    },
    FindStatus: (_, { id }) => {
      return StatusService.getOne(id)
    }
  },
  Mutation: {
    Login: (_, { email, password }) => {
      return AuthService.login(email, password)
    },
    CreateTicket: (
      _,
      { group, status, actualUser, openedBy, resume, content }
    ) => {
      TicketService.create({ group, status, actualUser, openedBy })
    }
  }
}

module.exports = resolvers
