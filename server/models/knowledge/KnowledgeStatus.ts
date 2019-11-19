import { models, model, Schema, Document } from 'mongoose'

export interface IKnowledgeStatus extends Document {
  name: string;
  description: string;
}

const KnowledgeStatusSchema: Schema<IKnowledgeStatus> = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Necessário atribuir um nome']
  },
  description: {
    type: String
  }
})

KnowledgeStatusSchema.set('toObject', {
  virtuals: true,
  getters: true
})

KnowledgeStatusSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

export default models.KnowledgeStatus || model('KnowledgeStatus', KnowledgeStatusSchema)
