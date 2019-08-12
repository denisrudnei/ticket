const { models, model, Schema } = require('mongoose')
const MessageSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  to: {
    type: mongoose.Types.ObjectId,
    ref: 'Analyst'
  },
  from: {
    type: mongoose.Types.ObjectId,
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

module.exports = models.Message || model('Message', MessageSchema)
