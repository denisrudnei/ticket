import { differenceInMinutes, format } from 'date-fns'
import { model, Schema, connection, Document } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import mongooseAutoIncrement from 'mongoose-auto-increment'
import { IAnalyst } from '../Analyst'
import { IAddress } from '../Address'
import Category, { ICategory } from './Category'
import { IGroup } from './Group'
import { IStatus } from './Status'
import { IComment } from './Comment'
import { IPriority } from './Priority'
import { ISla } from './Sla'
import { ILog } from './Log'

mongooseAutoIncrement.initialize(connection)

export interface ITicket extends Document {
  category: ICategory['_id']
  resume: string
  content: string
  group: IGroup['_id']
  address: IAddress['_id']
  status: IStatus['_id']
  comments: [IComment['_id']]
  affectedUser: IAnalyst['_id']
  openedBy: IAnalyst['_id']
  actualUser: IAnalyst['_id']
  priority: IPriority['_id']
  sla: ISla['_id']
  father: ITicket['_id']
  children: [ITicket['_id']]
  files: any[]
  logs: [ILog['_id']]
  slaCount: Date
  created: Date
  modified: Date
  overtakeSla(): Promise<Boolean>
  slaPercentage(): Promise<Number>
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
    ],
    slaCount: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'modified'
    }
  }
)

TicketSchema.methods.overtakeSla = async function() {
  const category = await Category.findOne({
    _id: this.category
  })
    .populate(['sla'])
    .exec()
  if (!category.sla) return false

  const slaBase = new Date('1970/01/01 00:00:00')
  const slaLimit = new Date(
    `1970/01/01 ${format(category.sla.limit, 'HH:mm:ss')}`
  )
  return (
    Math.abs(
      differenceInMinutes(new Date(this.created), new Date(this.slaCount))
    ) > Math.abs(differenceInMinutes(slaBase, slaLimit))
  )
}

TicketSchema.methods.slaPercentage = async function() {
  const category = await Category.findOne({
    _id: this.category
  })
    .populate(['sla'])
    .exec()
  if (!category.sla) return 0
  const slaBase = new Date('1970/01/01 00:00:00')
  const slaLimit = new Date(
    `1970/01/01 ${format(new Date(category.sla.limit), 'HH:mm:ss')}`
  )

  const base = Math.abs(differenceInMinutes(slaBase, slaLimit)) / 100

  const elapsed = Math.abs(
    differenceInMinutes(new Date(this.created), new Date(this.slaCount))
  )
  if (base === 0 || elapsed === 0) return 0

  return elapsed / base
}

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

export default model<ITicket>('Ticket', TicketSchema)
