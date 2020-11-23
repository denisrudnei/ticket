/* eslint-disable class-methods-use-this */
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { CustomExpressContext } from '~/server/types/UserSession';

import ChatEnum from '../enums/ChatEnum';
import Analyst from '../models/Analyst';
import Chat from '../models/chat/Chat';
import Message from '../models/chat/Message';
import ChatService from '../services/ChatService';
import AnalystStatus from '../enums/AnalystStatus';
import StatusColor from '../enums/StatusColor';

@Resolver((of) => Chat)
class ChatResolver {
  @Query(() => [Chat])
  @Authorized('user')
  Chat(@Ctx() { req }: CustomExpressContext) {
    const from = req!.session!.authUser!.id;
    return ChatService.getChats(from);
  }

  @Query(() => Chat)
  @Authorized('user')
  GetOneChat(
    @Arg('to', () => ID) to: Analyst['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const from = req!.session!.authUser!.id;
    return ChatService.getOne(from, to);
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  ChangeChatStatus(
    @Arg('status', () => AnalystStatus) status: AnalystStatus,
    @Ctx() context: CustomExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const userId = context.req.session!.authUser!.id;
    const changeStatus = ChatService.changeStatus(userId, status);
    pubSub.publish(ChatEnum.CHANGE_STATUS, changeStatus);
    return changeStatus;
  }

  @Query(() => [Message])
  @Authorized('user')
  GetUnReadMessagesFromChat(
    @Arg('chatId', () => ID) chatId: Chat['id'],
    @Ctx() { req }: CustomExpressContext,
  ) {
    const fromId = req!.session!.authUser!.id;
    return ChatService.getUnReadMessagesFromChat(chatId, fromId);
  }

  @Query(() => [[String]])
  AnalystStatus() {
    return Object.entries(AnalystStatus);
  }

  @Query(() => [[String]])
  StatusColor() {
    return Object.entries(StatusColor);
  }

  @Mutation(() => Message)
  @Authorized('user')
  SendMessage(
    @Arg('to', () => ID) to: Analyst['id'],
    @Arg('message') message: string,
    @Ctx() { req }: CustomExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Message> {
    const from = req!.session!.authUser!.id;
    const result = ChatService.addMessage(from, to, message);

    pubSub.publish(ChatEnum.NEW_CHAT_MESSAGE, result);
    return result;
  }

  @FieldResolver()
  async participants(@Root() root: Chat): Promise<Analyst[]> {
    const { participants } = (await Chat.findOne(root.id, { relations: ['participants'] }) as Chat);
    return participants;
  }

  @FieldResolver()
  async messages(@Root() root: Chat): Promise<Message[]> {
    const { messages } = (await Chat.findOne(root.id, { relations: ['messages'] }) as Chat);
    return messages;
  }

  @Subscription({
    topics: ChatEnum.NEW_CHAT_MESSAGE,
    filter: ({ payload, args }) => true,
  })
  NewMessage(
    @Root() messagePayload: Message,
    @Arg('to', () => ID) to: Analyst['id'],
  ): Message {
    return messagePayload;
  }

  @Subscription({
    topics: ChatEnum.CHANGE_STATUS,
    name: 'ChangeAnalystStatus',
  })
  ChangeStatusSubscription(@Root() payload: Analyst): Analyst {
    return payload;
  }
}
export default ChatResolver;
