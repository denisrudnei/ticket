const mongoose = require('mongoose')
const Status = require('../../models/ticket/Status')

const StatusService = {
  getStatus() {
    return new Promise((resolve, reject) => {
      Status.find({})
        .populate(['allowedStatus'])
        .exec((err, status) => {
          if (err) return reject(err)
          return resolve(status)
        })
    })
  },
  getOne(statusId) {
    return new Promise((resolve, reject) => {
      Status.findOne({
        _id: statusId
      })
        .populate(['allowedStatus'])
        .exec((err, status) => {
          if (err) return reject(err)
          return resolve(status)
        })
    })
  },
  create(status) {
    return new Promise((resolve, reject) => {
      const newStatus = {
        _id: new mongoose.Types.ObjectId(),
        ...status
      }

      Status.create(newStatus, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  edit(statusId, status) {
    return new Promise((resolve, reject) => {
      const allowedStatus = status.allowedStatus.filter(s => {
        return s._id !== statusId
      })
      Status.updateOne(
        {
          _id: statusId
        },
        {
          $set: {
            name: status.name,
            allowedStatus: allowedStatus
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

module.exports = StatusService
