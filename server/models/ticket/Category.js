const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
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
  fields: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Field'
    }
  ]
})

CategorySchema.virtual('fullName').get(function() {
  if (this.father === null || this.father === undefined) return this.name
  return `${this.father.fullName}.${this.name}`
})

CategorySchema.pre('find', function(next) {
  this.populate('father fields')
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

module.exports = mongoose.model('Category', CategorySchema)
