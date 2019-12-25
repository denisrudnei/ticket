import { models, model, Schema, Document, Model } from 'mongoose'
import Group, { IGroup } from './ticket/Group'
const bcrypt = require('bcrypt')

export interface IAnalyst extends Document {
  email: string
  status: string
  lastTimeActive: Date
  contactEmail: string
  name: string
  role: string
  password: string
  address: Schema.Types.ObjectId
  description: Schema.Types.ObjectId
  active: boolean
  picture: string
  mergePictureWithExternalAccount: boolean
  sounds: any
  chats: [Schema.Types.ObjectId]
  paths: [Schema.Types.ObjectId]
  getGroups: Function
  verifyPassword: Function
}

const AnalystSchema: Schema<IAnalyst> = new Schema({
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
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chat'
    }
  ],
  paths: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Path',
      select: false
    }
  ]
})

AnalystSchema.methods.getGroups = function(callback: Function) {
  Group.find(
    {
      analysts: {
        $in: [this._id]
      }
    },
    (err: Error, result: [IGroup]) => {
      callback(err, result)
    }
  )
}

AnalystSchema.pre<IAnalyst>('save', function(next) {
  const user = this
  if (!user.isModified('password')) return next()
  const salt = bcrypt.genSaltSync(12)
  bcrypt.hash(user.password, salt, function(err: Error, hash: string) {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

AnalystSchema.methods.verifyPassword = function(
  password: string,
  next: Function
) {
  bcrypt.compare(password, this.password, (err: Error, result: boolean) => {
    if (err) return next(err)
    if (!result) return next(new Error('Password incorrect'))
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

export default models.Analyst || model<IAnalyst>('Analyst', AnalystSchema)
