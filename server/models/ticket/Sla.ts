import { Schema, models, model, Document } from 'mongoose'

export interface ISla extends Document {
  name: string
  limit: Date
}

const SlaSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  limit: {
    type: Date
  }
})

export default models.Sla || model('Sla', SlaSchema)
