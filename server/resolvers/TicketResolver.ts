/* eslint-disable class-methods-use-this */
import NotificationService from '@/server/services/NotificationService';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';

import Ticket from '../../server/models/ticket/Ticket';
import NotificationEnum from '../enums/NotificationEnum';
import TicketEnum from '../enums/TicketEnum';
import TicketCreateInput from '../inputs/TicketCreateInput';
import TicketInput from '../inputs/TicketInput';
import Address from '../models/Address';
import Analyst from '../models/Analyst';
import File from '../models/File';
import Category from '../models/ticket/Category';
import Comment from '../models/ticket/Comment';
import Group from '../models/ticket/Group';
import Log from '../models/ticket/Log';
import Priority from '../models/ticket/Priority';
import Status from '../models/ticket/Status';
import TicketField from '../models/ticket/TicketField';
import LogService from '../services/ticket/LogService';
import TicketService from '../services/ticket/TicketService';

@Resolver((of) => Ticket)
class TicketResolver {
  @Query(() => Ticket)
  TicketById(@Arg('id', () => ID) id: Ticket['id']) {
    return TicketService.getOne(id);
  }
  // FIXME

  @FieldResolver()
  async logs(@Root() ticket: Ticket): Promise<Log[]> {
    const { logs } = (await Ticket.findOne(ticket.id, {
      relations: ['logs'],
    })) as Ticket;
    return logs!;
  }

  @FieldResolver()
  async comments(@Root() ticket: Ticket): Promise<Comment[]> {
    const { comments } = (await Ticket.findOne(ticket.id, {
      relations: ['comments'],
    }) as Ticket);

    return comments;
  }

  @FieldResolver()
  async children(@Root() ticket: Ticket): Promise<Ticket[]> {
    const { children } = (await Ticket.findOne(ticket.id, {
      relations: ['children'],
    }) as Ticket);
    return children;
  }

  @FieldResolver()
  async openedBy(@Root() ticket: Ticket): Promise<Analyst> {
    const { openedBy } = (await Ticket.findOne(ticket.id, {
      relations: ['openedBy'],
    }) as Ticket);
    return openedBy;
  }

  @FieldResolver()
  async actualUser(@Root() ticket: Ticket): Promise<Ticket['actualUser']> {
    const { actualUser } = (await Ticket.findOne(ticket.id, {
      relations: ['actualUser'],
    }) as Ticket);
    return actualUser;
  }

  @FieldResolver()
  async affectedUser(@Root() ticket: Ticket): Promise<Analyst> {
    const { affectedUser } = (await Ticket.findOne(ticket.id, {
      relations: ['affectedUser'],
    }) as Ticket);
    return affectedUser;
  }

  @FieldResolver()
  async group(@Root() ticket: Ticket): Promise<Group> {
    const { group } = (await Ticket.findOne(ticket.id, {
      relations: ['group'],
    }) as Ticket);
    return group;
  }

  @FieldResolver()
  async status(@Root() ticket: Ticket): Promise<Status> {
    const { status } = (await Ticket.findOne(ticket.id, {
      relations: ['status'],
    }) as Ticket);
    return status;
  }

  @FieldResolver()
  async priority(@Root() ticket: Ticket): Promise<Priority> {
    const { priority } = (await Ticket.findOne(ticket.id, {
      relations: ['priority'],
    }) as Ticket);
    return priority;
  }

  @FieldResolver()
  async address(@Root() ticket: Ticket): Promise<Address> {
    const { address } = (await Ticket.findOne(ticket.id, {
      relations: ['address'],
    }) as Ticket);
    return address;
  }

  @FieldResolver()
  async category(@Root() ticket: Ticket): Promise<Category> {
    const { category } = (await Ticket.findOne(ticket.id, {
      relations: ['category'],
    }) as Ticket);
    return category;
  }

  @FieldResolver()
  async father(@Root() ticket: Ticket): Promise<Ticket | null> {
    const { father } = (await Ticket.findOne(ticket.id, {
      relations: ['father'],
    }) as Ticket);
    return father;
  }

  @FieldResolver()
  async files(@Root() ticket: Ticket): Promise<File[]> {
    const { files } = (await Ticket.findOne(ticket.id, {
      relations: ['files'],
    }) as Ticket);
    return files;
  }

  @FieldResolver()
  async fields(@Root() ticket: Ticket): Promise<TicketField[]> {
    const { fields } = (await Ticket.findOne(ticket.id, { relations: ['fields'] }) as Ticket);
    return fields;
  }

  @FieldResolver()
  overtakeSla(@Root() ticket: Ticket) {
    return TicketService.overtakeSla(ticket.id);
  }

  @FieldResolver()
  slaPercentage(@Root() ticket: Ticket) {
    return TicketService.slaPercentage(ticket.id);
  }

  @Query(() => [Ticket])
  @Authorized('user')
  Tickets(
    @Arg('sortBy', () => String, {
      nullable: true,
      defaultValue: 'id',
    })
      sortBy: string,
    @Arg('descending', { nullable: true, defaultValue: -1 })
      descending: number,
    @Arg('page', () => Int, { nullable: true, defaultValue: 0 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return TicketService.getTickets(
      {},
      {
        sortBy,
        descending,
      },
      page,
      limit,
    );
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  async ChangeStatus(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('statusId', () => ID) statusId: Status['id'],
    @Ctx('pubSub') pubSub: PubSubEngine,
    @Ctx() { req }: ExpressContext,
  ): Promise<Ticket> {
    const user = req!.session!.authUser;
    const ticket = await TicketService.changeStatus(ticketId, statusId);
    LogService.createTicketLog(user.id, ticket!.id);
    pubSub.publish(TicketEnum.TICKET_CHANGE_STATUS, ticket);
    return ticket;
  }

  @Mutation(() => [Ticket])
  @Authorized('user')
  TransferTickets(
    @Arg('tickets', () => [ID]) tickets: Ticket['id'][],
    @Arg('groupId', () => ID) groupId: Group['id'],
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket[]> {
    const ticketsTransferred = TicketService.transferTickets(tickets, groupId);
    pubSub.publish(TicketEnum.TICKETS_TRANSFER_TO_GROUP, tickets);
    return ticketsTransferred;
  }

  @Mutation(() => [Ticket])
  @Authorized('user')
  ChangeStatusOfTickets(
    @Arg('tickets', () => [ID]) tickets: Ticket['id'][],
    @Arg('statusId', () => ID) statusId: Status['id'],
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket[]> {
    const statusChanged = TicketService.changeStatusOfTickets(tickets, statusId);
    pubSub.publish(TicketEnum.TICKETS_CHANGE_STATUS, tickets);
    return statusChanged;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  async TransferTicket(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('groupId', () => ID) groupId: Group['id'],
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: ExpressContext,
  ): Promise<Ticket> {
    const user = req!.session!.authUser;
    const ticket = await TicketService.transferToGroup(ticketId, groupId);
    const notification = await NotificationService.triggerForTicketTransfer(
      ticket.id,
      ticket!.group.id,
      user.id,
    );
    LogService.createTicketLog(user.id, ticket.id);
    pubSub.publish(NotificationEnum.ADD_NOTIFICATION, notification);
    pubSub.publish(TicketEnum.TICKET_TRANSFER_TO_GROUP, ticket);
    return ticket;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  async CreateTicket(
    @Arg('ticket', () => TicketCreateInput) ticket: Ticket,
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket> {
    const newTicket = Ticket.create(ticket);

    newTicket.openedBy = req!.session!.authUser;

    const createdTicket = await TicketService.create(newTicket);
    const notification = await NotificationService.triggerForTicketCreation(
      createdTicket,
    );
    pubSub.publish(NotificationEnum.ADD_NOTIFICATION, notification);
    return createdTicket;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  EditTicket(
    @Arg('id', () => ID) id: Ticket['id'],
    @Arg('ticket', () => TicketInput) ticket: Ticket,
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket> {
    const userId = req!.session!.authUser.id;
    LogService.createTicketLog(userId, ticket.id);
    const editedTicket = TicketService.updateOne(id, ticket);
    pubSub.publish(TicketEnum.TICKET_EDIT, editedTicket);
    return editedTicket;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  CopyTicket(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket> {
    const userId = req!.session!.authUser.id;
    const ticket = TicketService.copyTicket(ticketId, userId);
    pubSub.publish(TicketEnum.TICKET_COPY, ticket);
    return ticket;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  AddChildren(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('children', () => [ID]) children: Ticket[],
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket> {
    const addChildren = TicketService.addChildren(ticketId, children);
    pubSub.publish(TicketEnum.ADD_CHILDREN, addChildren);
    return addChildren;
  }

  @Mutation(() => Ticket)
  @Authorized('user')
  RemoveChildren(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('childrenId', () => ID) childrenId: Ticket['id'],
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Ticket> {
    const removeChildren = TicketService.removeChildren(ticketId, childrenId);
    pubSub.publish(TicketEnum.REMOVE_CHILDREN, removeChildren);
    return removeChildren;
  }

  @Mutation(() => Comment)
  @Authorized('user')
  CommentOnTicket(
    @Arg('ticketId', () => ID) ticketId: Ticket['id'],
    @Arg('content') content: string,
    @Ctx() context: ExpressContext,
  ) {
    const userId = context.req.session!.authUser!.id;
    return TicketService.commentOnTicket(ticketId, userId, content);
  }

  @Subscription({
    topics: TicketEnum.TICKET_TRANSFER_TO_GROUP,
  })
  TransferToGroup(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload;
  }

  @Subscription({
    name: 'ChangeStatus',
    topics: TicketEnum.TICKET_CHANGE_STATUS,
  })
  ChangeStatusSubscription(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload;
  }

  @Subscription({
    topics: TicketEnum.SLA_UPDATE,
    filter: ({ args, payload }) => {
      const tickets = args.tickets as Ticket['id'][];
      return tickets.includes(payload.id);
    },
  })
  SlaUpdate(
    @Root() ticketPayload: Ticket,
    @Arg('tickets', () => [ID]) tickets: Ticket['id'][],
  ): Ticket {
    return ticketPayload;
  }

  @Subscription({
    name: 'EditTicket',
    topics: TicketEnum.TICKET_EDIT,
    filter: ({ args, payload }) => {
      const tickets = args.tickets as Ticket['id'][];
      return tickets.includes(payload.id);
    },
  })
  EditTicketSubscription(
    @Root() ticketPayload: Ticket,
    @Arg('tickets', () => [ID]) tickets: Ticket['id'][],
  ): Ticket {
    return ticketPayload;
  }

  @Subscription({
    name: 'CopyTicket',
    topics: TicketEnum.TICKET_COPY,
  })
  CopyTicketSubscription(@Root() ticketPayload: Ticket): Ticket {
    return ticketPayload;
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

export default TicketResolver;
