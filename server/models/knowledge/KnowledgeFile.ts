import { Schema, model, models, Document } from 'mongoose'

export interface IKnowledgeFile extends Document {
  name: string;
  url: string;
}

const KnowledgeFileSchema: Schema<IKnowledgeFile> = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
})

KnowledgeFileSchema.set('toObject', {
  virtuals: true,
  getters: true
})

KnowledgeFileSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

export default
  models.KnowledgeFile || model('KnowledgeFile', KnowledgeFileSchema)
