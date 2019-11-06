const { models, model, Schema, connection } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const mongooseAutoIncrement = require('mongoose-auto-increment')

mongooseAutoIncrement.initialize(connection)

const TicketSchema = new Schema(
  {
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
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address'
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
    priority: {
      type: Schema.Types.ObjectId,
      ref: 'Priority'
    },
    sla: {
      type: Schema.Types.ObjectId,
      ref: 'Sla'
    },
    father: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
      }
    ],
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
    ]
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'modified'
    }
  }
)

TicketSchema.pre('find', function() {
  this.populate([
    'status',
    'group',
    'openedBy',
    'address',
    'affectedUser',
    'actualUser',
    'category',
    'priority'
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
TicketSchema.plugin(mongooseAutoIncrement.plugin, {
  model: 'Ticket',
  field: 'ticketNumber'
})

module.exports = models.Ticket || model('Ticket', TicketSchema)
