const { models, model, Schema } = require('mongoose')

const FileSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  }
})

module.exports = models.File || model('File', FileSchema)
