const { models, model, Schema } = require('mongoose')

const PathSchema = new Schema({
  _id: Schema.Types.ObjectId,
  objectName: {
    type: String
  },
  property: {
    type: String
  },
  name: {
    type: String,
    required: true
  }
})

PathSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

PathSchema.set('toObject', {
  getter: true,
  virtuals: true
})

module.exports = models.Path || model('Path', PathSchema)
