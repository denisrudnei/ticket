import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
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
  Subscription
} from 'type-graphql'

import ChatEnum from '../enums/ChatEnum'
import Analyst from '../models/Analyst'
import Chat from '../models/chat/Chat'
import Message from '../models/chat/Message'
import ChatService from '../services/ChatService'
import AnalystStatus from '../enums/AnalystStatus'
import StatusColor from '../enums/StatusColor'

@Resolver(of => Chat)
class ChatResolver {
  @Query(() => [Chat])
  @Authorized('user')
  Chat(@Ctx() { req }: ExpressContext) {
    const from = req!.session!.authUser.id
    return ChatService.getChats(from)
  }

  @Query(() => Chat)
  @Authorized('user')
  GetOneChat(
    @Arg('to', () => ID) to: Analyst['id'],
    @Ctx() { req }: ExpressContext
  ) {
    const from = req!.session!.authUser.id
    return ChatService.getOne(from, to)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  ChangeChatStatus(
    @Arg('status') status: AnalystStatus,
    @Ctx() context: ExpressContext
  ) {
    const userId = context.req.session!.authUser!.id
    return ChatService.changeStatus(userId, status)
  }

  @Query(() => [Message])
  @Authorized('user')
  GetUnReadMessagesFromChat(
    @Arg('chatId', () => ID) chatId: Chat['id'],
    @Ctx() { req }: ExpressContext
  ) {
    const fromId = req!.session!.authUser.id
    return ChatService.getUnReadMessagesFromChat(chatId, fromId)
  }

  @Query(() => [[String]])
  AnalystStatus() {
    return Object.entries(AnalystStatus)
  }

  @Query(() => [[String]])
  StatusColor() {
    return Object.entries(StatusColor)
  }

  @Mutation(() => Message)
  @Authorized('user')
  SendMessage(
    @Arg('to', () => ID) to: Analyst['id'],
    @Arg('message') message: string,
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Message> {
    const from = req!.session!.authUser.id
    const result = ChatService.addMessage(from, to, message)

    pubSub.publish(ChatEnum.NEW_CHAT_MESSAGE, result)
    return result
  }

  @FieldResolver()
  participants(@Root() root: Chat): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Chat.findOne(root.id, { relations: ['participants'] }).then(chat => {
        resolve(chat!.participants)
      })
    })
  }

  @FieldResolver()
  messages(@Root() root: Chat): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      Chat.findOne(root.id, { relations: ['messages'] }).then(chat => {
        resolve(chat!.messages)
      })
    })
  }

  @Subscription({
    topics: ChatEnum.NEW_CHAT_MESSAGE,
    filter: ({ payload, args }) => {
      // TODO
      return true
    }
  })
  NewMessage(
    @Root() messagePayload: Message,
    @Arg('to', () => ID) to: Analyst['id']
  ): Message {
    return messagePayload
  }
}
export default ChatResolver
