/* eslint-disable class-methods-use-this */
import { Root, Resolver, FieldResolver } from 'type-graphql';
import Comment from '@/server/models/ticket/Comment';
import Analyst from '@/server/models/Analyst';
import Ticket from '../models/ticket/Ticket';

@Resolver((of) => Comment)
class CommentResolver {
  @FieldResolver(() => Analyst)
  async user(@Root() root: Comment): Promise<Analyst> {
    const { user } = (await Comment.findOne(root.id, { relations: ['user'] }) as Comment);
    return user;
  }

  @FieldResolver(() => Ticket)
  async ticket(@Root() root: Comment): Promise<Ticket> {
    const { ticket } = (await Comment.findOne(root.id, { relations: ['ticket'] }) as Comment);
    return ticket;
  }
}

export default CommentResolver;
