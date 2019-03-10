const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnalystSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: {
    type: String
  },
  name: {
    type: String
  },
  password: {
    type: String
  },
  description: {
    type: String
  }
})

module.exports = new mongoose.model('Analyst', AnalystSchema)
