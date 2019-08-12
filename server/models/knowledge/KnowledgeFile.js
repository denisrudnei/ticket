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

module.exports =
  models.KnowledgeFile || model('KnowledgeFile', KnowledgeFileSchema)
