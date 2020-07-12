import { In } from 'typeorm'
import Message from '../models/chat/Message'
import Analyst from '../models/Analyst'
import Chat from '../models/chat/Chat'
import AnalystStatus from '../enums/AnalystStatus'

class ChatService {
  getChats(fromId: Analyst['id']): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      Chat.find({ relations: ['participants'] }).then(result => {
        const chats = result.filter(chat => {
          return chat.participants
            .map(participant => participant.id)
            .includes(fromId)
        })
        resolve(chats)
      })
    })
  }

  async getUnReadMessagesFromChat(
    chatId: Chat['id'],
    userId: Analyst['id']
  ): Promise<Message[]> {
    const chat = await Chat.findOne(chatId, {
      relations: ['messages', 'messages.from', 'messages.read']
    })

    // FIXME not getting analyst list from messages
    const unReadMessages = chat!.messages.filter(message => {
      return (
        message.from.id !== userId &&
        !message.read.map(analyst => analyst.id).includes(userId)
      )
    })
    return unReadMessages
  }

  readMessage(messageId: Message['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Message.findOne(messageId, { relations: ['read'] }).then(message => {
        message!.read = []
        message!.save().then(() => {
          resolve()
        })
      })
    })
  }

  getOne(fromId: Analyst['id'], toId: Analyst['id']): Promise<Chat> {
    return new Promise((resolve, reject) => {
      Chat.find({ relations: ['participants', 'messages'] }).then(
        async result => {
          const to = await Analyst.findOne(toId)
          const from = await Analyst.findOne(fromId)

          const chats = result.filter(chat => {
            const participantsIds = chat.participants.map(
              participant => participant.id
            )
            return (
              participantsIds.includes(from!.id) &&
              participantsIds.includes(to!.id)
            )
          })
          if (chats.length === 0) {
            const chat = Chat.create()
            chat.participants = []
            chat.messages = []
            chat.participants.push(to!, from!)
            chat.save().then(chat => {
              resolve(chat)
            })
          } else {
            resolve(chats[0])
          }
        }
      )
    })
  }

  addMessage(
    fromId: Analyst['id'],
    toId: Analyst['id'],
    content: string
  ): Promise<Message> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(fromId, { relations: ['chats'] }).then(async from => {
        const to = await Analyst.findOne(toId, { relations: ['chats'] })

        const chat = await this.getOne(fromId, toId)
        from!.chats.push(chat)
        const message = Message.create()
        message.to = to!
        message.from = from!
        message.date = new Date()
        message.content = content!
        message.save().then(() => {
          chat.messages.push(message)
          chat.save().then(() => {
            resolve(message)
          })
        })
      })
    })
  }

  get(fromId: Analyst['id'], toId: Analyst['id']): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      Message.find({
        where: [
          {
            from: fromId,
            to: toId
          },
          {
            from: toId,
            to: fromId
          }
        ]
      }).then((messages: Message[]) => {
        return resolve(messages)
      })
    })
  }

  changeStatus(userId: Analyst['id'], status: AnalystStatus): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(analyst => {
        analyst!.status = status
        analyst!.save().then(() => {
          resolve(analyst)
        })
      })
    })
  }

  updateLastActive(userId: Analyst['id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then(analyst => {
        analyst!.lastTimeActive = new Date()
        analyst!.save().then(() => {
          resolve(analyst)
        })
      })
    })
  }
}

export default new ChatService()
