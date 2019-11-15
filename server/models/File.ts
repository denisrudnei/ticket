const { models, model, Schema } = require('mongoose')

const FileSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  }
})

FileSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

FileSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = models.File || model('File', FileSchema)
