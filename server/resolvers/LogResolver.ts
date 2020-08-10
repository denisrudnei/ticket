/* eslint-disable class-methods-use-this */
import { FieldResolver, Resolver, Root } from 'type-graphql';
import Analyst from '../models/Analyst';
import Log from '../models/ticket/Log';
import Status from '../models/ticket/Status';
import Group from '../models/ticket/Group';
import Ticket from '../models/ticket/Ticket';

@Resolver((of) => Log)
class LogResolver {
  @FieldResolver(() => Analyst)
  async user(@Root() root: Log): Promise<Analyst> {
    const { user } = (await Log.findOne(root.id, { relations: ['user'] }) as Log);
    return user;
  }

  @FieldResolver(() => Status)
  async oldStatus(@Root() root: Log): Promise<Status> {
    const { oldStatus } = (await Log.findOne(root.id, { relations: ['oldStatus'] }) as Log);
    return oldStatus;
  }

  @FieldResolver(() => Status)
  async newStatus(@Root() root: Log): Promise<Status> {
    const { newStatus } = (await Log.findOne(root.id, { relations: ['newStatus'] }) as Log);
    return newStatus;
  }

  @FieldResolver(() => Group)
  async group(@Root() root: Log): Promise<Group> {
    const { group } = (await Log.findOne(root.id, { relations: ['group'] }) as Log);
    return group;
  }

  @FieldResolver(() => Ticket)
  async ticket(@Root() root: Log): Promise<Ticket> {
    const { ticket } = (await Log.findOne(root.id) as Log);
    return ticket;
  }
}

export default LogResolver;
