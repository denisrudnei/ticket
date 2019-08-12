const { models, model, Schema } = require('mongoose')

const KnowledgeStatusSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  description: {
    type: String
  }
})

module.exports =
  models.KnowledgeStatus || model('KnowledgeStatus', KnowledgeStatusSchema)
