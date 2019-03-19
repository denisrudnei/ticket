const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  from: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  to: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ],
  date: {
    type: Date,
    default: new Date()
  },
  name: String,
  content: String,
  type: String,
  read: {
    type: Boolean,
    default: false
  }
})

module.exports = new mongoose.model('Notification', NotificationSchema)
