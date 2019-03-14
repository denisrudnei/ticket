const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  from: {
    type: Object,
    ref: 'Analyst'
  },
  to: [
    {
      type: Object,
      ref: 'Analyst'
    }
  ],
  name: String,
  content: String,
  type: String,
  read: {
    type: Boolean,
    default: false
  }
})

module.exports = new mongoose.model('Notification', NotificationSchema)
