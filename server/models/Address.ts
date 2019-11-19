import { models, model, Schema, Document } from 'mongoose'

export interface IAddress extends Document {
  name: string;
  country: string;
  street: string;
  cep: string;
  city: string;
  state: string;
}

const AddressSchema: Schema<IAddress> = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  country: {
    type: String
  },
  street: {
    type: String
  },
  cep: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  }
})

AddressSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

AddressSchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Address || model('Address', AddressSchema)
