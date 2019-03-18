const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnalystSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    required: [true, 'Necessário preencher o email']
  },
  name: {
    type: String,
    required: [true, 'Necessário preencher um nome']
  },
  password: {
    type: String
  },
  description: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  picture: String
})

module.exports = new mongoose.model('Analyst', AnalystSchema)
