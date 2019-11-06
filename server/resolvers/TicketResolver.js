const TicketService = require('../services/ticket/TicketService')
const TicketEnum = require('../enums/TicketEnum')
const LogService = require('../services/ticket/LogService')

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
    ChangeStatus: async (_, { ticketId, statusId }, { pubSub, req }) => {
      const user = req.session.authUser
      const ticket = TicketService.changeStatus(ticketId, statusId)
      LogService.createTicketLog(user._id, ticket)
      pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, {
        ChangeStatus: ticket
      })
      return ticket
    },
    TransferTicket: (_, { ticketId, groupId }, { req, pubSub }) => {
      const user = req.session.authUser
      const ticket = TicketService.transferToGroup(ticketId, groupId)
      // TODO
      LogService.createTicketLog(user._id, ticket)
      pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, {
        TransferToGroup: ticket
      })
      return ticket
    },
    CreateTicket: (_, { ticket }, { req }) => {
      const {
        group,
        status,
        category,
        actualUser,
        affectedUser,
        resume,
        content,
        priority
      } = ticket
      const newTicket = {
        group,
        status,
        category,
        actualUser,
        affectedUser,
        openedBy: req.session.authUser,
        resume,
        content,
        priority
      }
      return TicketService.create(newTicket)
    },
    EditTicket: (_, { _id, ticket }, { req }) => {
      const userId = req.session.authUser._id
      LogService.createTicketLog(userId, {
        ...ticket,
        _id
      })
      return TicketService.updateOne(_id, ticket)
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
