const mongoose = require('mongoose')
const KnowledgeStatus = require('../../models/knowledge/KnowledgeStatus')

const KnowledgeStatusService = {
  create(status) {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.create(
        {
          _id: new mongoose.Types.ObjectId(),
          ...status
        },
        (err, result) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  },
  getAll() {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find({}, (err, result) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
}
module.exports = KnowledgeStatusService
