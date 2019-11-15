const { models, model, Schema } = require('mongoose')

const GroupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  analysts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ]
})

GroupSchema.pre('find', function() {
  this.populate(['analysts'])
})

GroupSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

GroupSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = models.Group || model('Group', GroupSchema)
