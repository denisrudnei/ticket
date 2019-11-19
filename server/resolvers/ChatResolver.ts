import { Context } from 'graphql-yoga/dist/types'
import { withFilter } from 'graphql-yoga'
import ChatService from '../services/ChatService'
import ChatEnum from '../enums/ChatEnum'

const ChatResolver = {
  Query: {
    Chat: (_: any, __: any, { req }: Context) => {
      const from = req.session.authUser._id
      return ChatService.getChats(from)
    },
    GetOneChat: (_: any, { to }: any, { req }: Context) => {
      const from = req.session.authUser._id
      return ChatService.getOne(from, to)
    }
  },
  Mutation: {
    SendMessage: (_: any, { to, message }: any, { pubSub, req }: Context) => {
      const from = req.session.authUser._id
      const result = ChatService.addMessage(from, to, message)

      pubSub.publish(ChatEnum.NEW_CHAT_MESSAGE, {
        NewMessage: result
      })
      return result
    }
  },
  Subscription: {
    NewMessage: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator(ChatEnum.NEW_CHAT_MESSAGE)
        },
        async (payload, { to }) => {
          const { NewMessage } = await payload
          const value = await NewMessage
          return value.to._id.toString() === to
        }
      )
    }
  }
}

export default ChatResolver
