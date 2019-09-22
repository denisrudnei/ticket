const TicketService = require('../services/ticket/TicketService')
const TicketEnum = require('../enums/TicketEnum')

const TicketResolver = {
  Query: {
    TicketById: (_, { _id }) => {
      return TicketService.getOne(_id)
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
    ChangeStatus: async (_, { ticketId, statusId }, { pubSub }) => {
      const ticket = TicketService.changeStatus(ticketId, statusId)
      pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, {
        ChangeStatus: ticket
      })
      return ticket
    },
    TransferTicket: (_, { ticketId, groupId }, { req, pubSub }) => {
      const ticket = TicketService.transferToGroup(
        ticketId,
        groupId,
        req.session.authUser
      )
      pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, {
        TransferToGroup: ticket
      })
      return ticket
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
  },
  Subscription: {
    TransferToGroup: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TicketEnum.TICKET_TRANSFER_TO_GROUP)
      }
    },
    ChangeStatus: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TicketEnum.TICKET_CHANGE_STATUS)
      }
    },
    EditTicket: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TicketEnum.TICKET_EDIT)
      }
    }
  }
}

module.exports = TicketResolver
