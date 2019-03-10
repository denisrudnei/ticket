const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  father: {
    type: Object,
    ref: 'Category'
  },
  description: {
    type: String
  },
  subs: [
    {
      type: Object,
      ref: 'Category'
    }
  ],
  defaultGroup: {
    type: Object,
    ref: 'Group'
  },
  fields: [
    {
      type: Object,
      ref: 'Field'
    }
  ]
})

CategorySchema.virtual('fullName').get(function() {
  if (this.father === null || this.father === undefined) return this.name
  return `${this.father.fullName}.${this.name}`
})

CategorySchema.set('toJSON', {
  getters: true,
  virtuals: true
})

CategorySchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = new mongoose.model('Category', CategorySchema)
