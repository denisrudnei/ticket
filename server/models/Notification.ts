const { models, model, Schema } = require('mongoose')
const TicketEnums = require('../enums/TicketEnum')
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
  type: {
    type: String,
    enum: [
      TicketEnums.TICKET_CHANGE_STATUS,
      TicketEnums.TICKET_TRANSFER_TO_GROUPs,
      TicketEnums.TICKET_EDIT
    ]
  },
  meta: {
    type: Object
  },
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

NotificationSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

NotificationSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports =
  models.Notification || model('Notification', NotificationSchema)
