const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KnowledgeCategory = new Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String
  },
  description: {
    type: String
  }
})

module.exports = new mongoose.model('KnowledgeCategory', KnowledgeCategory)
