/* eslint-disable class-methods-use-this */
import { Root, Resolver, FieldResolver } from 'type-graphql';
import Comment from '@/server/models/ticket/Comment';
import Analyst from '@/server/models/Analyst';
import Ticket from '../models/ticket/Ticket';

@Resolver((of) => Comment)
class CommentResolver {
  @FieldResolver(() => Analyst)
  user(@Root() root: Comment): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Comment.findOne(root.id, { relations: ['user'] }).then((comment) => {
        resolve(comment!.user);
      });
    });
  }

  @FieldResolver(() => Ticket)
  ticket(@Root() root: Comment): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Comment.findOne(root.id, { relations: ['ticket'] }).then((comment) => {
        resolve(comment!.ticket);
      });
    });
  }
}

export default CommentResolver;
