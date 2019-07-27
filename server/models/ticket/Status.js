const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatusSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Necessário identificar o status']
  }
})

module.exports = mongoose.model('Status', StatusSchema)
