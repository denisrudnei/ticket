import { models, model, Schema, Document } from 'mongoose'

export interface IPath extends Document {
  objectName: string
  property: string
  name: string
}

const PathSchema = new Schema({
  _id: Schema.Types.ObjectId,
  objectName: {
    type: String
  },
  property: {
    type: String
  },
  name: {
    type: String,
    required: true
  }
})

PathSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

PathSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Path || model('Path', PathSchema)
