const { models, model, Schema } = require('mongoose')

const PathSchema = new Schema({
  _id: Schema.Types.ObjectId,
  path: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

PathSchema.virtual('fullPath').get(function() {
  return `${this.path}.${this.group}`
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
