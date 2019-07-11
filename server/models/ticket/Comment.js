const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
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

module.exports = new mongoose.model('Comment', CommentSchema)
