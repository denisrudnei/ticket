import { models, model, Schema, Document } from 'mongoose'
import { IAnalyst } from '../Analyst'
import { IStatus } from './Status'
import { IGroup } from './Group'

export interface ILog extends Document {
  user: IAnalyst['_id']
  date: Date
  oldStatus: IStatus['_id']
  group: IGroup['_id']
  newStatus: IStatus['_id']
}

const LogSchema: Schema<ILog> = new Schema({
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

LogSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

LogSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Log || model('Log', LogSchema)
