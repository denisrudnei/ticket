import NotificationService from '@/server/services/NotificationService'
import {
  Query,
  Resolver,
  Mutation,
  Subscription,
  Arg,
  Ctx,
  PubSubEngine,
  ID,
  FieldResolver,
  Root,
  Authorized,
  Int,
  PubSub
} from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import TicketService from '../services/ticket/TicketService'
import TicketEnum from '../enums/TicketEnum'
import LogService from '../services/ticket/LogService'
import Ticket from '../../server/models/ticket/Ticket'
import NotificationEnum from '../enums/NotificationEnum'
import Group from '../models/ticket/Group'
import Status from '../models/ticket/Status'
import Log from '../models/ticket/Log'
import Comment from '../models/ticket/Comment'
import TicketInput from '../inputs/TicketInput'
import TicketCreateInput from '../inputs/TicketCreateInput'

@Resolver(of => Ticket)
class TicketResolver {
  @Query(() => Ticket)
  TicketById(@Arg('id', () => ID) id: Ticket['id']) {
    return TicketService.getOne(id)
  }
  // FIXME

  @FieldResolver()
  logs(@Root() ticket: Ticket): Promise<Log[]> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticket.id, {
        relations: ['logs']
      }).then(() => {
        resolve(ticket!.logs)
      })
    })
  }

  @FieldResolver()
  comments(@Root() ticket: Ticket): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticket.id, {
        relations: ['comments']
      }).then(() => {
        resolve(ticket!.comments)
      })
    })
  }

  @FieldResolver()
  children(@Root() ticket: Ticket): Promise<Ticket[]> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticket.id, {
        relations: ['children']
      }).then(() => {
        resolve(ticket!.children)
      })
    })
  }

  @FieldResolver()
  overtakeSla(@Root() ticket: Ticket) {
    return TicketService.overtakeSla(ticket.id)
  }

  @FieldResolver()
  slaPercentage(@Root() ticket: Ticket) {
    return TicketService.slaPercentage(ticket.id)
  }

  @Query(() => [Ticket])
  @Authorized('user')
  Tickets(
    @Arg('sortBy', () => String, {
      nullable: true,
      defaultValue: 'id'
    })
    sortBy: string,
    @Arg('descending', { nullable: true, defaultValue: false })
    descending: boolean,
    @Arg('page', () => Int, { nullable: true, defaultValue: 0 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 }) limit: number
  ) {
    return TicketService.getTickets(
      {},
      {
        [sortBy]: descending
      },
      page,
      limit
    )
  }

  @Mutation(type => Ticket)
  @Authorized('user')
  async ChangeStatus(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('statusId', () => ID) statusId: Status['id'],
    @Ctx('pubSub') pubSub: PubSubEngine,
    @Ctx() { req }: ExpressContext
  ): Promise<Ticket> {
    const user = req!.session!.authUser
    const ticket = await TicketService.changeStatus(ticketId, statusId)
    LogService.createTicketLog(user.id, ticket!.id)
    pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, ticket)
    return ticket
  }

  @Mutation(() => [Ticket])
  @Authorized('user')
  TransferTickets(
    @Arg('tickets', () => [ID]) tickets: Ticket['id'][],
    @Arg('groupId', () => ID) groupId: Group['id'],
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket[]> {
    const ticketsTransferred = TicketService.transferTickets(tickets, groupId)
    pubSub.publish(TicketEnum.TICKETS_TRANSFER_TO_GROUP, tickets)
    return ticketsTransferred
  }

  @Mutation(() => [Ticket])
  @Authorized('user')
  ChangeStatusOfTickets(
    @Arg('ticket', type => [ID]) tickets: Ticket['id'][],
    @Arg('statusId', type => ID) statusId: Status['id'],
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket[]> {
    const statusChanged = TicketService.changeStatusOfTickets(tickets, statusId)
    pubSub.publish(TicketEnum.TICKETS_CHANGE_STATUS, tickets)
    return statusChanged
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  async TransferTicket(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('groupId', () => ID) groupId: Group['id'],
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: ExpressContext
  ): Promise<Ticket> {
    const user = req!.session!.authUser
    const ticket = await TicketService.transferToGroup(ticketId, groupId)
    const notification = await NotificationService.triggerForTicketTransfer(
      ticket.id,
      ticket!.group.id,
      user.id
    )
    LogService.createTicketLog(user.id, ticket.id)
    pubSub.publish(NotificationEnum.ADD_NOTIFICATION, notification)
    pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, ticket)
    return ticket
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  async CreateTicket(
    @Arg('ticket', () => TicketCreateInput) ticket: Ticket,
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket> {
    const newTicket = Ticket.create(ticket)

    newTicket.openedBy = req!.session!.authUser

    const createdTicket = await TicketService.create(newTicket)
    const notification = await NotificationService.triggerForTicketCreation(
      createdTicket
    )
    pubSub.publish(NotificationEnum.ADD_NOTIFICATION, notification)
    return createdTicket
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  EditTicket(
    @Arg('id', () => ID) id: Ticket['id'],
    @Arg('ticket', () => TicketInput) ticket: Ticket,
    @Ctx() ExpressContext: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket> {
    const { req } = ExpressContext
    const userId = req!.session!.authUser.id
    LogService.createTicketLog(userId, ticket.id)
    const editedTicket = TicketService.updateOne(id, ticket)
    pubSub.publish(TicketEnum.TICKET_EDIT, editedTicket)
    return editedTicket
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  CopyTicket(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Ctx() { req }: ExpressContext
  ): Promise<Ticket> {
    const userId = req!.session!.authUser.id
    return TicketService.copyTicket(ticketId, userId)
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  AddChildren(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('children', () => [ID]) children: Ticket[],
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket> {
    const addChildren = TicketService.addChildren(ticketId, children)
    pubSub.publish(TicketEnum.ADD_CHILDREN, addChildren)
    return addChildren
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  RemoveChildren(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('childrenId', () => ID) childrenId: Ticket['id'],
    @PubSub() pubSub: PubSubEngine
  ): Promise<Ticket> {
    const removeChildren = TicketService.removeChildren(ticketId, childrenId)
    pubSub.publish(TicketEnum.REMOVE_CHILDREN, removeChildren)
    return removeChildren
  }

  @Subscription({
    topics: TicketEnum.TICKET_TRANSFER_TO_GROUP
  })
  TransferToGroup(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload
  }

  @Subscription({
    name: 'ChangeStatus',
    topics: TicketEnum.TICKET_CHANGE_STATUS
  })
  ChangeStatusSubscription(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload
  }

  @Subscription({
    topics: TicketEnum.SLA_UPDATE
  })
  SlaUpdate(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload
  }

  @Subscription({
    name: 'EditTicket',
    topics: TicketEnum.TICKET_EDIT
  })
  EditTicketSubscription(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload
  }

  //   }
  //   EditTicket: {
  //     subscribe: withFilter(
  //       (_: any, __, { pubSub }) => {
  //         return pubSub.asyncIterator(TicketEnum.TICKET_EDIT)
  //       },
  //       async (payload, { tickets }) => {
  //         const { EditTicket } = await payload
  //         const value = await EditTicket
  //         return tickets.includes(value.id.toString())
  //       }
  //     )
  //   }
  //   SlaUpdate: {
  //     subscribe: withFilter(
  //       (_: any, __: any, { pubSub }: ExpressContext) => {
  //         return pubSub.asyncIterator(TicketEnum.SLA_UPDATE)
  //       },
  //       async (payload, { tickets }) => {
  //         const { SlaUpdate } = await payload

  //         const value = await SlaUpdate

  //         return tickets.includes(value.id.toString())
  //       }
  //     )
  //   }
}

export default TicketResolver
