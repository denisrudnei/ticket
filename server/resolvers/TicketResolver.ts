import { withFilter } from 'graphql-yoga'
import TicketService from '../services/ticket/TicketService'
import TicketEnum from '../enums/TicketEnum'
import LogService from '../services/ticket/LogService'
import { Context } from 'graphql-yoga/dist/types'
import Ticket from '../../server/models/ticket/Ticket'

const TicketResolver = {
  Query: {
    TicketById: (_: any, { _id }: any) => {
      return TicketService.getOne(_id)
    },
    Tickets: (_: Context, { sortBy, descending, page, limit }: any) => {
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
    ChangeStatus: async (_: any, { ticketId, statusId }: any, { pubSub, req }: Context) => {
      const user = req.session.authUser
      const ticket = await TicketService.changeStatus(ticketId, statusId)
      LogService.createTicketLog(user._id, ticket!)
      pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, {
        ChangeStatus: ticket
      })
      return ticket
    },
    TransferTicket: async (_: any, { ticketId, groupId }: any, { req, pubSub }: Context) => {
      const user = req.session.authUser
      const ticket = await TicketService.transferToGroup(ticketId, groupId)
      // TODO
      LogService.createTicketLog(user._id, ticket)
      pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, {
        TransferToGroup: ticket
      })
      return ticket
    },
    CreateTicket: (_: any, { ticket }: any, { req }: Context) => {
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
      const newTicket = new Ticket({
        group,
        status,
        category,
        actualUser,
        affectedUser,
        openedBy: req.session.authUser,
        resume,
        content,
        priority
      })
      return TicketService.create(newTicket)
    },
    EditTicket: (_: any, { _id, ticket }: any, { req, pubSub }: Context) => {
      const userId = req.session.authUser._id
      LogService.createTicketLog(userId, {
        ...ticket,
        _id
      })
      const editedTicket = TicketService.updateOne(_id, ticket)
      pubSub.publish(TicketEnum.TICKET_EDIT, {
        EditTicket: editedTicket
      })
      return editedTicket
    },
    CopyTicket(_: any, { ticketId }: any, { req }: Context) {
      const userId = req.session.authUser._id
      return TicketService.copyTicket(ticketId, userId)
    }
  },
  Subscription: {
    TransferToGroup: {
      subscribe: (_: any, __: any, { pubSub }: Context) => {
        return pubSub.asyncIterator(TicketEnum.TICKET_TRANSFER_TO_GROUP)
      }
    },
    ChangeStatus: {
      subscribe: (_: any, __: any, { pubSub }: Context) => {
        return pubSub.asyncIterator(TicketEnum.TICKET_CHANGE_STATUS)
      }
    },
    EditTicket: {
      subscribe: withFilter(
        (_: any, __, { pubSub }) => {
          return pubSub.asyncIterator(TicketEnum.TICKET_EDIT)
        },
        async (payload, { tickets }) => {
          const { EditTicket } = await payload
          const value = await EditTicket
          return tickets.includes(value._id.toString())
        }
      )
    }
  }
}

export default TicketResolver
