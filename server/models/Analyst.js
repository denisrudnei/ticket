const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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
  role: {
    type: String,
    default: 'user',
    enum: ['guest', 'user', 'admin'],
    required: [true, 'O nível de acesso deve ser definido']
  },
  password: {
    type: String,
    select: false
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

AnalystSchema.methods.getGroups = function(callback) {
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
}

AnalystSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) return next()
  const salt = bcrypt.genSaltSync(12)
  bcrypt.hash(user.password, salt, function(err, hash) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

AnalystSchema.methods.verifyPassword = function(password, next) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) return next(err)
    return next(null, result)
  })
}

AnalystSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

AnalystSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = new mongoose.model('Analyst', AnalystSchema)
