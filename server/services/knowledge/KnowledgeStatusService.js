const mongoose = require('mongoose')
const KnowledgeStatus = require('../../models/knowledge/KnowledgeStatus')

const KnowledgeStatusService = {
  create(status, callback) {
    KnowledgeStatus.create(
      {
        _id: new mongoose.Types.ObjectId(),
        ...status
      },
      (err, result) => {
        return callback(err, result)
      }
    )
  },
  getAll(callback) {
    KnowledgeStatus.find({}, (err, result) => {
      return callback(err, result)
    })
  }
}
module.exports = KnowledgeStatusService
