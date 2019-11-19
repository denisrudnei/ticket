import { Schema, models, model, Document } from 'mongoose'

export interface ISla extends Document {
  limit: Date
}

const SlaSchema = new Schema({
  _id: Schema.Types.ObjectId,
  limit: {
    type: Date
  }
})

export default models.Sla || model('Sla', SlaSchema)
