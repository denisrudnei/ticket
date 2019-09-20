const TicketService = require('../services/ticket/TicketService')

const TicketResolver = {
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
    }
  },
  Mutation: {
    ChangeStatus: (_, { ticketId, statusId }) => {
      return TicketService.changeStatus(ticketId, statusId)
    },
    TransferTicket: (_, { ticketId, groupId }, { req }) => {
      return TicketService.transferToGroup(
        ticketId,
        groupId,
        req.session.authUser
      )
    },
    CreateTicket: (
      _,
      { group, status, actualUser, category, resume, content },
      { req }
    ) => {
      const ticket = {
        group,
        status,
        category,
        actualUser,
        openedBy: req.session.authUser,
        resume,
        content
      }
      return TicketService.create(ticket)
    }
  }
}

module.exports = TicketResolver
