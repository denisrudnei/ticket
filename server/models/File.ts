import { models, model, Schema, Document } from 'mongoose'

export interface IFile extends Document {
  name: string;
}

const FileSchema: Schema<IFile> = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  }
})

FileSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

FileSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.File || model('File', FileSchema)
