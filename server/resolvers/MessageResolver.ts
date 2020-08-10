/* eslint-disable class-methods-use-this */
import { Resolver, FieldResolver, Root } from 'type-graphql';
import Message from '../models/chat/Message';
import Chat from '../models/chat/Chat';
import Analyst from '../models/Analyst';

@Resolver((of) => Message)
class MessageResolver {
  @FieldResolver(() => Chat)
  async chat(@Root() root: Message): Promise<Chat> {
    const { chat } = (await Message.findOne(root.id, { relations: ['chat'] }) as Message);
    return chat;
  }

  @FieldResolver(() => Analyst)
  async from(@Root() root: Message): Promise<Analyst> {
    const { from } = (await Message.findOne(root.id, { relations: ['from'] }) as Message);
    return from;
  }

  @FieldResolver(() => Analyst)
  async to(@Root() root: Message): Promise<Analyst> {
    const { to } = (await Message.findOne(root.id, { relations: ['to'] }) as Message);
    return to;
  }
}

export default MessageResolver;
