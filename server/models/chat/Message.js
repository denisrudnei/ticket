const { models, model, Schema } = require('mongoose')
const MessageSchema = new Schema({
  _id: Schema.Types.ObjectId,
  to: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  content: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})

MessageSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

MessageSchema.pre('find', function() {
  this.populate(['to', 'from'])
})

module.exports = models.Message || model('Message', MessageSchema)
