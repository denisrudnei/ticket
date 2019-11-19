import { models, model, Schema, Document } from 'mongoose'
import { IAnalyst } from '../Analyst'

export interface IComment extends Document {
  user: IAnalyst['_id'];
  content: string;
  date: Date;
}

const CommentSchema: Schema<IComment> = new Schema({
  _id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Analyst'
  },
  content: {
    type: String,
    required: [true, 'Necessário comentar algo']
  },
  date: {
    type: Date,
    default: Date.now
  }
})

CommentSchema.pre('find', function() {
  this.populate('user')
})

CommentSchema.set('toObject', {
  getters: true,
  virtuals: true
})

CommentSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

export default models.Comment || model('Comment', CommentSchema)
