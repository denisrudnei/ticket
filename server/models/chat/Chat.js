const { models, model, Schema } = require('mongoose')

const ChatSchema = new Schema({
  _id: Schema.Types.ObjectId,
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Analyst'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ]
})

module.exports = models.Chat || model('Chat', ChatSchema)
