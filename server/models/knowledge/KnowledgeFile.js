const { Schema, model, models } = require('mongoose')

const KnowledgeFileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
})

KnowledgeFileSchema.set('toObject', {
  virtuals: true,
  getters: true
})

KnowledgeFileSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

module.exports =
  models.KnowledgeFile || model('KnowledgeFile', KnowledgeFileSchema)
