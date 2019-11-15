const { models, model, Schema } = require('mongoose')

const AddressSchema = new Schema({
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

module.exports = models.Address || model('Address', AddressSchema)
