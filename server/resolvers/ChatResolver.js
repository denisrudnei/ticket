const { withFilter } = require('graphql-yoga')
const ChatService = require('../services/ChatService')
const ChatEnum = require('../enums/ChatEnum')
const ChatResolver = {
  Query: {
    Chat: (_, __, { req }) => {
      const from = req.session.authUser._id
      return ChatService.getChats(from)
    },
    GetOneChat: (_, { to }, { req }) => {
      const from = req.session.authUser._id
      return ChatService.getOne(from, to)
    }
  },
  Mutation: {
    SendMessage: (_, { to, message }, { pubSub, req }) => {
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

module.exports = ChatResolver
