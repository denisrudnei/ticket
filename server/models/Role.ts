import { models, model, Schema, Document } from 'mongoose'

export interface IRole extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
}

const RoleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String
  },
  description: {
    type: Schema.Types.String
  }
})

RoleSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

RoleSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Role || model('Role', RoleSchema)
