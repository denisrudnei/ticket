import { withFilter } from 'graphql-yoga'
import { Context } from 'graphql-yoga/dist/types'
import { IResolvers } from 'graphql-tools'
import NotificationService from '@/server/services/NotificationService'
import TicketService from '../services/ticket/TicketService'
import TicketEnum from '../enums/TicketEnum'
import LogService from '../services/ticket/LogService'
import Ticket, { ITicket } from '../../server/models/ticket/Ticket'
import NotificationEnum from '../enums/NotificationEnum'

const TicketResolver: IResolvers = {
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
    ChangeStatus: async (
      _: any,
      { ticketId, statusId }: any,
      { pubSub, req }: Context
    ) => {
      const user = req.session.authUser
      const ticket = await TicketService.changeStatus(ticketId, statusId)
      LogService.createTicketLog(user._id, ticket!)
      pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, {
        ChangeStatus: ticket
      })
      return ticket
    },
    TransferTickets: (_: any, { tickets, groupId }, { pubSub }: Context) => {
      const ticketsTransferred = TicketService.transferTickets(tickets, groupId)
      pubSub.publish(TicketEnum.TICKETS_TRANSFER_TO_GROUP, {
        TransferManyTickets: tickets
      })
      return ticketsTransferred
    },
    ChangeStatusOfTickets: (
      _: any,
      { tickets, statusId },
      { pubSub }: Context
    ) => {
      const statusChanged = TicketService.changeStatusOfTickets(
        tickets,
        statusId
      )
      pubSub.publish(TicketEnum.TICKETS_CHANGE_STATUS, {
        ChangeStatusOfTickets: tickets
      })
      return statusChanged
    },
    TransferTicket: async (
      _: any,
      { ticketId, groupId }: any,
      { req, pubSub }: Context
    ) => {
      const user = req.session.authUser
      const ticket = await TicketService.transferToGroup(ticketId, groupId)
      // TODO
      LogService.createTicketLog(user._id, ticket)
      pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, {
        TransferToGroup: ticket
      })
      return ticket
    },
    CreateTicket: async (_: any, { ticket }: any, { req, pubSub }: Context) => {
      const {
        group,
        status,
        category,
        address,
        actualUser,
        affectedUser,
        resume,
        content,
        priority
      } = ticket
      const newTicket = new Ticket({
        group,
        status,
        address,
        category,
        actualUser,
        affectedUser,
        openedBy: req.session.authUser,
        resume,
        content,
        priority
      })
      const createdTicket = await TicketService.create(newTicket)
      const notification = await NotificationService.triggerForTicketCreation(
        createdTicket
      )
      pubSub.publish(NotificationEnum.ADD_NOTIFICATION, {
        AddNotification: notification
      })
      return createdTicket
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
    },
    AddChildren: (_: any, { ticketId, children }: any, { pubSub }: Context) => {
      const addChildren = TicketService.addChildren(ticketId, children)
      pubSub.publish(TicketEnum.ADD_CHILDREN, {
        AddChildren: addChildren
      })
      return addChildren
    },
    RemoveChildren: (
      _: any,
      { ticketId, childrenId }: any,
      { pubSub }: Context
    ) => {
      const removeChildren = TicketService.removeChildren(ticketId, childrenId)
      pubSub.publish(TicketEnum.REMOVE_CHILDREN, {
        RemoveChildren: removeChildren
      })
      return removeChildren
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
    },
    SlaUpdate: {
      subscribe: withFilter(
        (_: any, __: any, { pubSub }: Context) => {
          return pubSub.asyncIterator(TicketEnum.SLA_UPDATE)
        },
        async (payload, { tickets }) => {
          const { SlaUpdate } = await payload

          const value = await SlaUpdate

          return tickets.includes(value._id.toString())
        }
      )
    }
  },
  Ticket: {
    overtakeSla: ({ _id }: ITicket) => {
      return TicketService.overtakeSla(_id)
    },
    slaPercentage: ({ _id }: ITicket) => {
      return TicketService.slaPercentage(_id)
    }
  }
}

export default TicketResolver
