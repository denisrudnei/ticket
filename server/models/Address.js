const { models, model, Schema } = require('mongoose')

const AddressSchema = new Schema({
  _id: Schema.Types.ObjectId,
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

module.exports = models.Address || model('Address', AddressSchema)
