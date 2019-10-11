const mongoose = require('mongoose')
const Message = require('../models/chat/Message')
const Analyst = require('../models/Analyst')
const Chat = require('../models/chat/Chat')

const ChatService = {
  getChats(fromId) {
    return new Promise((resolve, reject) => {
      Chat.find({
        participants: {
          $in: [fromId]
        }
      })
        .populate(['participants', 'messages'])
        .exec((err, result) => {
          if (err) reject(err)
          resolve(result)
        })
    })
  },
  getOne(fromId, toId) {
    return new Promise((resolve, reject) => {
      Chat.findOne({
        participants: {
          $all: [fromId, toId]
        }
      })
        .populate(['participants', 'messages'])
        .exec((err, result) => {
          if (err) reject(err)
          if (result === null) {
            Chat.create(
              {
                _id: new mongoose.Types.ObjectId(),
                participants: [toId, fromId]
              },
              (err, result) => {
                if (err) reject(err)
                Chat.populate(result, ['participants'], (err, chat) => {
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
  },
  addMessage(fromId, toId, content) {
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
        (err, message) => {
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
          ).exec(err => {
            if (err) reject(err)
            Message.populate(message, ['to', 'from'], (err, result) => {
              if (err) reject(err)
              resolve(result)
            })
          })
        }
      )
    })
  },
  get(fromId, toId) {
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
        .exec((err, messages) => {
          if (err) return reject(err)
          return resolve(messages)
        })
    })
  },
  changeStatus(userId, status) {
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
      ).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  },
  updateLastActive(userId) {
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
      ).exec((err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
}

module.exports = ChatService
