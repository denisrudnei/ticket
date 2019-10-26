const { models, model, Schema } = require('mongoose')

const PrioritySchema = new Schema({
  weight: {
    type: Number,
    required: [true, 'Necessário um valor']
  },
  name: {
    type: String,
    default: '',
    required: [true, 'Precisa de uma descrição']
  }
})

module.exports = models.Priority || model('Priority', PrioritySchema)
