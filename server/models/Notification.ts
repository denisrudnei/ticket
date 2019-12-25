import { models, model, Schema, Document } from 'mongoose'
import TicketEnums from '../enums/TicketEnum'
import { IAnalyst } from './Analyst'

export interface INotification extends Document {
  from: IAnalyst['_id']
  to: [IAnalyst['_id']]
  date: Date
  name: string
  read: [IAnalyst['_id']]
  content: string
  type: string
  meta: any
}

const NotificationSchema: Schema<INotification> = new Schema({
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
      TicketEnums.TICKET_TRANSFER_TO_GROUP,
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

export default models.Notification || model('Notification', NotificationSchema)
