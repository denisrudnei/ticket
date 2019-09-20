const { models, model, Schema } = require('mongoose')

const RoleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: Schema.Types.String
  },
  description: {
    type: Schema.Types.String
  }
})

RoleSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

RoleSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = models.Role || model('Role', RoleSchema)
