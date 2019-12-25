import { models, model, Schema, Document } from 'mongoose'
import { IGroup } from './Group'
import { IStatus } from './Status'
import { IPriority } from './Priority'
import { IField } from './Field'
import { ISla } from './Sla'

export interface ICategory extends Document {
  name: string
  father: ICategory['_id']
  description: string
  subs: [ICategory['_id']]
  defaultGroup: IGroup['_id']
  defaultStatus: IStatus['_id']
  defaultPriority: IPriority['_id']
  fields: [IField['_id']]
  sla: ISla['_id']
}

const CategorySchema: Schema<ICategory> = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  father: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String
  },
  subs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  defaultGroup: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  defaultStatus: {
    type: Schema.Types.ObjectId,
    ref: 'Status'
  },
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field'
    }
  ],
  defaultPriority: {
    type: Schema.Types.ObjectId,
    ref: 'Priority'
  },
  sla: {
    type: Schema.Types.ObjectId,
    ref: 'Sla'
  }
})

CategorySchema.virtual('fullName').get(function(this: ICategory) {
  if (this.father === null || this.father === undefined) return this.name
  return `${this.father.fullName}.${this.name}`
})

CategorySchema.pre('find', function(next) {
  this.populate(['father', 'fields'])
  next()
})

CategorySchema.pre('findOne', function(next) {
  this.populate(['father', 'fields', 'subs'])
  next()
})

CategorySchema.set('toJSON', {
  getters: true,
  virtuals: true
})

CategorySchema.set('toObject', {
  getters: true,
  virtuals: true
})

export default models.Category || model('Category', CategorySchema)
