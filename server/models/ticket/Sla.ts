import { Schema, models, model, Document } from 'mongoose'

export interface ISla extends Document {
  name: string
  limit: Date
}

const SlaSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Required field']
  },
  limit: {
    type: Date,
    required: [true, 'Required field']
  }
})

export default models.Sla || model('Sla', SlaSchema)
