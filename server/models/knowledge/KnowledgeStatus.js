const { models, model, Schema } = require('mongoose')

const KnowledgeStatusSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Necessário atribuir um nome']
  },
  description: {
    type: String
  }
})

KnowledgeStatusSchema.set('toObject', {
  virtuals: true,
  getters: true
})

KnowledgeStatusSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

module.exports =
  models.KnowledgeStatus || model('KnowledgeStatus', KnowledgeStatusSchema)
