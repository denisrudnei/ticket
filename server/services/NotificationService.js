const Notification = require('../models/Notification')
const fields = ['to', 'from']

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
  }
}

module.exports = NotificationService
