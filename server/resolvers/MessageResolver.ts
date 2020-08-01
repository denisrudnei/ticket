/* eslint-disable class-methods-use-this */
import { Resolver, FieldResolver, Root } from 'type-graphql';
import Message from '../models/chat/Message';
import Chat from '../models/chat/Chat';
import Analyst from '../models/Analyst';

@Resolver((of) => Message)
class MessageResolver {
  @FieldResolver(() => Chat)
  chat(@Root() root: Message): Promise<Chat> {
    return new Promise((resolve, reject) => {
      Message.findOne(root.id, { relations: ['chat'] }).then((message) => {
        resolve(message!.chat);
      });
    });
  }

  @FieldResolver(() => Analyst)
  from(@Root() root: Message): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Message.findOne(root.id, { relations: ['from'] }).then((message) => {
        resolve(message!.from);
      });
    });
  }

  @FieldResolver(() => Analyst)
  to(@Root() root: Message): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Message.findOne(root.id, { relations: ['to'] }).then((message) => {
        resolve(message!.to);
      });
    });
  }
}

export default MessageResolver;
