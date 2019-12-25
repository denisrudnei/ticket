import { models, model, Schema, Document } from 'mongoose'

export interface IField extends Document {
  required: boolean
  text: string
  limits: ILimits
  value: string
}

export interface ILimits {
  min: number
  max: number
}

const FieldSchema = new Schema({
  _id: Schema.Types.ObjectId,
  required: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  limits: {
    type: Object,
    default: {
      min: Number.MIN_SAFE_INTEGER,
      max: 50
    }
  },
  value: {
    type: String,
    default: ''
  }
})

FieldSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

FieldSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Field || model('Field', FieldSchema)
