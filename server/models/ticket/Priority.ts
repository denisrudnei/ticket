import { models, model, Schema, Document } from 'mongoose'

export interface IPriority extends Document {
  weight: number
  name: string
}

const PrioritySchema: Schema<IPriority> = new Schema({
  weight: {
    type: Number,
    required: [true, 'Necessário um valor']
  },
  name: {
    type: String,
    default: '',
    required: [true, 'Precisa de uma descrição']
  }
})

export default models.Priority || model('Priority', PrioritySchema)
