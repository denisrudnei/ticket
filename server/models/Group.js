const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Ticket = require('./Ticket')

const GroupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  }
})

module.exports = new mongoose.model('Group', GroupSchema)
