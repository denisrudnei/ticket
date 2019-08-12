const { models, model, Schema } = require('mongoose')
const LogSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  date: {
    type: Date,
    default: new Date()
  },
  oldStatus: {
    type: Schema.Types.ObjectId,
    ref: 'Status'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  newStatus: {
    type: Schema.Types.ObjectId,
    ref: 'Status'
  }
})

LogSchema.pre('find', function() {
  this.populate(['user', 'group', 'oldStatus', 'newStatus'])
})

module.exports = models.Log || model('Log', LogSchema)
