const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KnowledgeSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  knowledgeCategory: {
    type: Schema.Types.ObjectId,
    ref: 'KnowledgeCategory'
  },
  preview: {
    type: String
  },
  url: {
    type: String
  }
})

module.exports = new mongoose.model('Knowledge', KnowledgeSchema)
