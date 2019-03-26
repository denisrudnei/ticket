const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Group = require('./Group')

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

AnalystSchema.method('getGroups', function(callback) {
  Group.find(
    {
      analysts: {
        $in: [this._id]
      }
    },
    (err, result) => {
      callback(err, result)
    }
  )
})

AnalystSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

AnalystSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = new mongoose.model('Analyst', AnalystSchema)
