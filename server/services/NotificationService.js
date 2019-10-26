const Notification = require('../models/Notification')
const fields = ['to', 'from']
const TicketService = require('../services/ticket/TicketService')
const GroupService = require('../services/ticket/GroupService')
const AnalystService = require('../services/AnalystService')
const Log = require('../models/ticket/Log')
const mongoose = require('mongoose')

const NotificationService = {
  getAll(userId) {
    return new Promise((resolve, reject) => {
      Notification.find({
        to: {
          $in: [userId]
        }
      })
        .populate(fields)
        .exec((err, notifications) => {
          if (err) return reject(err)
          return resolve(notifications)
        })
    })
  },
  getOne(id) {
    return new Promise((resolve, reject) => {
      Notification.findOne({ _id: id })
        .populate(fields)
        .exec((err, notification) => {
          if (err) return reject(err)
          return resolve(notification)
        })
    })
  },
  read(userId, notificationId) {
    return new Promise((resolve, reject) => {
      Notification.updateOne(
        {
          _id: notificationId
        },
        {
          $addToSet: {
            read: [userId]
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve(this.getOne(notificationId))
      })
    })
  },
  unRead(userId, notificationId) {
    return new Promise((resolve, reject) => {
      Notification.updateOne(
        {
          _id: notificationId
        },
        {
          $pull: {
            read: {
              $in: [userId]
            }
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve(this.getOne(notificationId))
      })
    })
  },
  toggleRead(userId, notificationId) {
    return new Promise((resolve, reject) => {
      return this.getOne(notificationId).then(notification => {
        const read = notification.read.includes(userId)
        if (read) return resolve(this.unRead(userId, notificationId))
        return resolve(this.read(userId, notificationId))
      })
    })
  },
  readall(userId) {
    return new Promise((resolve, reject) => {
      Notification.updateMany(
        {
          to: {
            $in: [userId]
          }
        },
        {
          $addToSet: {
            read: [userId]
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve(this.getAll(userId))
      })
    })
  },
  triggerForTicketTransfer(ticketId, groupId, analystId) {
    return new Promise(async (resolve, reject) => {
      const ticket = await TicketService.getOne(ticketId)
      const group = await GroupService.getOne(groupId)
      const analyst = await AnalystService.getOne(analystId)

      Notification.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'TicketTransfer',
          from: analyst._id,
          to: group.analysts,
          meta: {
            ticket
          },
          content: `${analyst.name} transferiu um chamado para seu grupo`
        },
        (err, notification) => {
          if (err) reject(err)
          resolve(notification)
        }
      )
    })
  }
}

module.exports = NotificationService
