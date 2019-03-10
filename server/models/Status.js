const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatusSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  }
})

module.exports = new mongoose.model('Status', StatusSchema)
