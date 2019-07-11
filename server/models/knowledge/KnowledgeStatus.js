const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KnowledgeStatusSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String
  },
  description: {
    type: String
  }
})

module.exports = new mongoose.model('KnowledgeStatus', KnowledgeStatusSchema)
