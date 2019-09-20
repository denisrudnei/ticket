const { models, model, Schema } = require('mongoose')
const KnowledgeSchema = new Schema({
  _id: Schema.Types.ObjectId,
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
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Knowledgefile'
    }
  ]
})

KnowledgeSchema.pre('find', function() {
  this.populate(['category', 'group', 'status'])
})

KnowledgeSchema.pre('findOne', function() {
  this.populate(['category', 'group', 'status'])
})

KnowledgeSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

KnowledgeSchema.set('toObject', {
  virtuals: true,
  getters: true
})

module.exports = models.Knowledge || model('Knowledge', KnowledgeSchema)
