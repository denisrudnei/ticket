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
    ref: 'Category',
    required: [true, 'Necessário haver uma categoria relacionada']
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Necessário haver um grupo relacionado']
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'KnowledgeStatus'
  },
  preview: {
    type: String
  },
  url: {
    type: String
  }
})

KnowledgeSchema.pre('find', function() {
  this.populate(['category', 'group', 'status'])
})

KnowledgeSchema.pre('findOne', function() {
  this.populate(['category', 'group', 'status'])
})

module.exports = new mongoose.model('Knowledge', KnowledgeSchema)
