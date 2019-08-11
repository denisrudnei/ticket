const { Schema, model } = require('mongoose')

const KnowledgeFileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
})

module.exports = model('KnowledgeFile', KnowledgeFileSchema)
