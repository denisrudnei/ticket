import mongoose, {Types, ModelPopulateOptions} from 'mongoose'
import Message, {IMessage} from '../models/chat/Message'
import Analyst from '../models/Analyst'
import Chat, {IChat} from '../models/chat/Chat'

class ChatService {
  getChats(fromId: mongoose.Types.ObjectId): Promise<[IChat]> {
    return new Promise((resolve, reject) => {
      Chat.find({
        participants: {
          $in: [fromId]
        }
      })
        .populate(['participants', 'messages'])
        .exec((err: Error, result: [IChat]) => {
          if (err) reject(err)
          resolve(result)
        })
    })
  }
  getOne(fromId: Types.ObjectId, toId: Types.ObjectId): Promise<IChat> {
    return new Promise((resolve, reject) => {
      Chat.findOne({
        participants: {
          $all: [fromId, toId]
        }
      })
        .populate(['participants', 'messages'])
        .exec((err: Error, result) => {
          if (err) reject(err)
          if (result === null) {
            Chat.create(
              {
                _id: new Types.ObjectId(),
                participants: [toId, fromId]
              },
              (err: Error, result: IChat) => {
                if (err) reject(err)
                Chat.populate<IChat>(result, [{path: 'participants'}], (err: Error, chat: IChat) => {
                  if (err) reject(err)
                  resolve(chat)
                })
              }
            )
          } else {
            resolve(result)
          }
        })
    })
  }
  addMessage(fromId: Types.ObjectId, toId: Types.ObjectId, content: string) {
    return new Promise(async (resolve, reject) => {
      const to = await Analyst.findOne({ _id: toId })
      const from = await Analyst.findOne({ _id: fromId })
        .populate(['chats'])
        .exec()
      const chat = await this.getOne(fromId, toId)
      await Analyst.updateOne(
        { _id: fromId },
        { $addToSet: { chats: chat._id } }
      ).exec()
      const messageId = new mongoose.Types.ObjectId()
      Message.create(
        {
          _id: messageId,
          to: to._id,
          from: from._id,
          data: new Date(),
          content: content
        },
        (err: Error, message: IMessage) => {
          if (err) return reject(err)
          Chat.updateOne(
            {
              _id: chat._id
            },
            {
              $addToSet: {
                messages: [messageId]
              }
            }
          ).exec((err: Error) => {
            if (err) reject(err)
            Message.populate<IMessage>(message, [{path: 'to'}, {path: 'from'}], (err: Error, result: IMessage) => {
              if (err) reject(err)
              resolve(result)
            })
          })
        }
      )
    })
  }
  get(fromId: Types.ObjectId, toId: Types.ObjectId) {
    return new Promise((resolve, reject) => {
      Message.find({
        $or: [
          {
            from: fromId,
            to: toId
          },
          {
            from: toId,
            to: fromId
          }
        ]
      })
        .populate([
          {
            path: 'to',
            select: {
              password: 0
            }
          },
          {
            path: 'from',
            select: {
              password: 0
            }
          }
        ])
        .exec((err: Error, messages) => {
          if (err) return reject(err)
          return resolve(messages)
        })
    })
  }
  changeStatus(userId: Types.ObjectId, status: string) {
    return new Promise((resolve, reject) => {
      Analyst.updateOne(
        {
          _id: userId
        },
        {
          $set: {
            status: status
          }
        }
      ).exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
  updateLastActive(userId: Types.ObjectId) {
    return new Promise((resolve, reject) => {
      Analyst.updateOne(
        {
          _id: userId
        },
        {
          $set: {
            lastTimeActive: Date.now()
          }
        }
      ).exec((err: Error, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
}

export default new ChatService()
