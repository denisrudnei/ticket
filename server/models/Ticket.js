const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Log = require('./Log')

const TicketSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  category: {
    ref: 'Category',
    type: Object,
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
    type: Object,
    ref: 'Group',
    required: [true, 'Necessário estar em um grupo']
  },
  status: {
    ref: 'Status',
    type: Object,
    required: [true, 'Deve ter um status']
  },
  actualUser: {
    type: Object,
    ref: 'Analyst',
    required: [true, 'É necessário abrir o chamado em nome de alguém']
  },
  openedBy: {
    type: Object,
    ref: 'Analyst',
    required: [true, 'É necessário abrir o chamado em nome de alguém']
  },
  files: [
    {
      type: Object,
      ref: 'File'
    }
  ],
  logs: [
    {
      type: Object,
      ref: 'Log'
    }
  ],
  created: {
    type: Date,
    default: new Date()
  },
  modified: {
    type: Date,
    default: new Date()
  }
})

async function createLog(ticket) {
  const log = await Log.create({
    _id: new mongoose.Types.ObjectId(),
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

module.exports = mongoose.model('Ticket', TicketSchema)
