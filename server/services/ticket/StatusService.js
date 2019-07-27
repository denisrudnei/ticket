const mongoose = require('mongoose')
const Status = require('../../models/ticket/Status')

const StatusService = {
  getStatus() {
    return new Promise((resolve, reject) => {
      Status.find({}, (err, status) => {
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
  }
}

module.exports = StatusService
