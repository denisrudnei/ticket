import { models, model, Schema, connection, Document } from 'mongoose'
import { ICategory } from './Category'
import { IGroup } from './Group'
import { IAddress } from '../Address'
import { IStatus } from './Status'
import { IComment } from './Comment'
import { IAnalyst } from '../Analyst'
import { IPriority } from './Priority'
import { ISla } from './Sla'
import { ILog } from './Log'
import mongoosePaginate from 'mongoose-paginate'
import mongooseAutoIncrement from 'mongoose-auto-increment'

mongooseAutoIncrement.initialize(connection)

export interface ITicket extends Document {
  category: ICategory['_id'];
  resume: string;
  content: string;
  group: IGroup['_id'];
  address: IAddress['_id'];
  status: IStatus['_id'];
  comments: [IComment['_id']];
  affectedUser: IAnalyst['_id'];
  openedBy: IAnalyst['_id'];
  actualUser: IAnalyst['_id'];
  priority: IPriority['_id'];
  sla: ISla['_id'];
  father: ITicket['_id'];
  children: [ITicket['_id']];
  files: [any];
  logs: [ILog['_id']]
}

const TicketSchema: Schema<ITicket> = new Schema(
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

// interface TicketModel<T extends Document> extends PaginateModel<T>{}

// const ticketModel: TicketModel<ITicket> = model<ITicket>('Ticket', TicketSchema)

export default  model<ITicket>('Ticket', TicketSchema)

