const { Schema, models, model } = require('mongoose')

const SlaSchema = new Schema({
  _id: Schema.Types.ObjectId,
  limit: {
    type: Date
  }
})

module.exports = models.Sla || model('Sla', SlaSchema)
