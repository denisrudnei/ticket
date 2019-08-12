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
  this.populate(['status', 'group', 'openedBy', 'actualUser', 'category'])
})

async function createLog(ticket) {
  const log = await Log.create({
    _id: new Types.ObjectId(),
    oldStatus: ticket.status,
    date: new Date(),
    user: ticket.actualUser,
    group: ticket.group
  })
  ticket.logs.push(log)
}

TicketSchema.pre('save', async function(next) {
  const ticket = this
  await createLog(ticket)
  next()
})

// TODO
TicketSchema.pre('findOneAndUpdate', async function(next) {
  const ticket = this
  await createLog(ticket)
  next()
})

TicketSchema.plugin(mongoosePaginate)

module.exports = models.Ticket || model('Ticket', TicketSchema)
