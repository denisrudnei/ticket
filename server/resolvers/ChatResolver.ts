import {
  Mutation,
  Resolver,
  FieldResolver,
  Query,
  Ctx,
  Arg,
  ID,
  Root,
  Subscription,
  PubSub,
  PubSubEngine,
  Args,
  Authorized
} from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import ChatService from '../services/ChatService'
import ChatEnum from '../enums/ChatEnum'
import Chat from '../models/chat/Chat'
import Analyst from '../models/Analyst'
import Message from '../models/chat/Message'

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

  @Query(() => [Message])
  @Authorized('user')
  GetUnReadMessagesFromChat(
    @Arg('chatId', () => ID) chatId: Chat['id'],
    @Ctx() { req }: ExpressContext
  ) {
    const fromId = req!.session!.authUser.id
    return ChatService.getUnReadMessagesFromChat(chatId, fromId)
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

  @Subscription({
    topics: ChatEnum.NEW_CHAT_MESSAGE,
    filter: ({ payload, args }) => {
      // TODO
      return true
    }
  })
  NewMessage(@Root() messagePayload: Message): Message {
    return messagePayload
  }
}
export default ChatResolver
