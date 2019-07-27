const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
  date: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model('Message', MessageSchema)
