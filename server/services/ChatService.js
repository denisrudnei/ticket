const mongoose = require('mongoose')
const Message = require('../models/chat/Message')
const Analyst = require('../models/Analyst')

const ChatService = {
  create(fromId, toId, content) {
    return new Promise(async (resolve, reject) => {
      const to = await Analyst.findOne({ _id: toId }).exec()
      const from = await Analyst.findOne({ _id: fromId })

      Message.create(
        {
          _id: new mongoose.Types.ObjectId(),
          to: to._id,
          from: from._id,
          data: new Date(),
          content: content
        },
        err => {
          if (err) return reject(err)
          const messageToSend = {
            to: to,
            from: from,
            content: content
          }
          return resolve(messageToSend)
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
