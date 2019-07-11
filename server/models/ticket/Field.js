const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fieldSchema = new Schema({
  _id: Schema.Types.ObjectId,
  required: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  limits: {
    type: Object,
    default: {
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    }
  }
})

module.exports = mongoose.model('Field', fieldSchema)
