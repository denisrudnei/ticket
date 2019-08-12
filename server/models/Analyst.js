const { models, model, Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const Group = require('./ticket/Group')

const AnalystSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    select: false,
    required: [true, 'Necessário preencher o email']
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy']
  },
  lastTimeActive: {
    type: Date,
    default: Date.now
  },
  contactEmail: {
    type: String,
    required: false,
    default: ''
  },
  name: {
    type: String,
    required: [true, 'Necessário preencher um nome']
  },
  role: {
    type: String,
    default: 'user',
    enum: ['guest', 'user', 'admin'],
    required: [true, 'O nível de acesso deve ser definido'],
    select: false
  },
  color: {
    type: String,
    default: '',
    select: false
  },
  password: {
    type: String,
    select: false
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address'
  },
  description: {
    type: String
  },
  active: {
    type: Boolean,
    default: false,
    select: false
  },
  picture: {
    type: String,
    default: '/user.svg'
  },
  mergePictureWithExternalAccount: {
    type: Boolean,
    default: false,
    select: false
  },
  sounds: {
    type: Object,
    default: {
      chat: {
        volume: 0,
        muted: true
      },
      notification: {
        volume: 0,
        muted: false
      }
    }
  },
  paths: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Path',
      select: false
    }
  ]
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
    if (!result)
      return next(
        new Error({
          message: 'Password incorrect'
        })
      )
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

module.exports = models.Analyst || model('Analyst', AnalystSchema)
