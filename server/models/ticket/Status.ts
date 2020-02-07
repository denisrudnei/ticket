import { models, model, Schema, Document } from 'mongoose'

export interface IStatus extends Document {
  name: string
  allowedStatus: [IStatus['_id']]
  slaRun: boolean
}

const StatusSchema: Schema<IStatus> = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Necessário identificar o status']
  },
  allowedStatus: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Status'
    }
  ],
  slaRun: {
    type: Boolean,
    default: false
  }
})

StatusSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

StatusSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Status || model('Status', StatusSchema)
