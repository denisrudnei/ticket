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
  user(@Root() root: Log): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Log.findOne(root.id, { relations: ['user'] }).then((log) => {
        resolve(log!.user);
      });
    });
  }

  @FieldResolver(() => Status)
  oldStatus(@Root() root: Log): Promise<Status> {
    return new Promise((resolve, reject) => {
      Log.findOne(root.id, { relations: ['oldStatus'] }).then((log) => {
        resolve(log!.oldStatus);
      });
    });
  }

  @FieldResolver(() => Status)
  newStatus(@Root() root: Log): Promise<Status> {
    return new Promise((resolve, reject) => {
      Log.findOne(root.id, { relations: ['newStatus'] }).then((log) => {
        resolve(log!.newStatus);
      });
    });
  }

  @FieldResolver(() => Group)
  group(@Root() root: Log): Promise<Group> {
    return new Promise((resolve, reject) => {
      Log.findOne(root.id, { relations: ['group'] }).then((log) => {
        resolve(log!.group);
      });
    });
  }

  @FieldResolver(() => Ticket)
  ticket(@Root() root: Log): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Log.findOne(root.id).then((log) => {
        resolve(log!.ticket);
      });
    });
  }
}

export default LogResolver;
