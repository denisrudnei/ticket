const { models, model, Schema, Types } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Log = require('./Log')

const TicketSchema = new Schema({
  _id: Schema.Types.ObjectId,
  category: {
    ref: 'Category',
    type: Schema.Types.ObjectId,
    required: [true, 'Preencha a categoria']
  },
  resume: {
    type: String,
    required: [true, 'Deve ter uma descrição']
  },
  content: {
    type: String,
    required: [true, 'Deve ter um conteúdo']
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Necessário estar em um grupo']
  },
  status: {
    ref: 'Status',
    type: Schema.Types.ObjectId,
    required: [true, 'Deve ter um status']
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  affectedUser: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  actualUser: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst',
    required: [true, 'É necessário abrir o chamado em nome de alguém']
  },
  openedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst',
    required: [true, 'É necessário abrir o chamado em nome de alguém']
  },
  files: [
    {
      type: Object
    }
  ],
  logs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Log'
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
})

TicketSchema.pre('find', function() {
  this.populate([
    'status',
    'group',
    'openedBy',
    'affectedUser',
    'actualUser',
    'category'
  ])
})

TicketSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

TicketSchema.set('toObject', {
  getters: true,
  virtuals: true
})

TicketSchema.plugin(mongoosePaginate)

module.exports = models.Ticket || model('Ticket', TicketSchema)
