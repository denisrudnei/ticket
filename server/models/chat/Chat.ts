import { models, model, Schema, Document } from 'mongoose'

export interface IChat extends Document {
  participants: [Schema.Types.ObjectId];
  messages: [Schema.Types.ObjectId];
}

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

export default models.Chat || model('Chat', ChatSchema)
