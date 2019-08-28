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
    default: Date.now
  },
  name: String,
  content: String,
  type: String,
  read: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ]
})

NotificationSchema.pre('find', function() {
  this.populate(['to', 'from'])
})

module.exports =
  models.Notification || model('Notification', NotificationSchema)
