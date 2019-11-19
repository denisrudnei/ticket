import { models, model, Schema, Document } from 'mongoose'
import { ICategory } from '../ticket/Category'
import { IGroup } from '../ticket/Group'
import { IStatus } from '../ticket/Status'
import { IKnowledgeFile } from './KnowledgeFile'

export interface IKnowledge extends Document {
  name: string;
  created: Date;
  category: ICategory['_id'];
  group: IGroup['_id'];
  status: IStatus['_id'];
  preview: string;
  files: [IKnowledgeFile['_id']]
}

const KnowledgeSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Necessário haver uma categoria relacionada']
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Necessário haver um grupo relacionado']
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'KnowledgeStatus'
  },
  preview: {
    type: String
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'KnowledgeFile'
    }
  ]
})

KnowledgeSchema.pre('find', function() {
  this.populate(['category', 'group', 'status'])
})

KnowledgeSchema.pre('findOne', function() {
  this.populate(['category', 'group', 'status'])
})

KnowledgeSchema.set('toJSON', {
  virtuals: true,
  getters: true
})

KnowledgeSchema.set('toObject', {
  virtuals: true,
  getters: true
})

export default models.Knowledge || model('Knowledge', KnowledgeSchema)
