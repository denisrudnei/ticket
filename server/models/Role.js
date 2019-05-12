const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId
  },
  name: {
    type: Schema.Types.String
  },
  description: {
    type: Schema.Types.String
  }
})

module.exports = mongoose.model('Role', RoleSchema)
