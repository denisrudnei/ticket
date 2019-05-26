const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = new mongoose.model('Address', AddressSchema)
