import { models, model, Schema, Document } from 'mongoose'
import { IAnalyst } from '../Analyst'

export interface IGroup extends Document {
  name: string;
  analysts: [IAnalyst['_id']]
}

const GroupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  analysts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ]
})

GroupSchema.pre('find', function() {
  this.populate(['analysts'])
})

GroupSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

GroupSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Group || model('Group', GroupSchema)
