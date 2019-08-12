const { models, model, Schema } = require('mongoose')

const NotificationSchema = new Schema({
  _id: Schema.Types.ObjectId,
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

NotificationSchema.pre('find', function() {
  this.populate(['to', 'from'])
})

module.exports =
  models.Notification || model('Notification', NotificationSchema)
