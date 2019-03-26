const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  analysts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ]
})

GroupSchema.pre('find', function() {
  this.populate(['analysts'])
})

module.exports = new mongoose.model('Group', GroupSchema)
