const { models, model, Schema } = require('mongoose')

const StatusSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Necessário identificar o status']
  },
  allowedStatus: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Status'
    }
  ]
})

StatusSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

StatusSchema.set('toObject', {
  getters: true,
  virtuals: true
})

module.exports = models.Status || model('Status', StatusSchema)
