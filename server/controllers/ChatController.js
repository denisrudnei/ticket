const mongoose = require('mongoose')
const Message = require('../models/chat/Message')
const Analyst = require('../models/Analyst')

module.exports = (app, io) => {
  app.post('/chat/message', async (req, res) => {
    const to = await Analyst.findOne({ _id: req.body.to._id })
    const from = await Analyst.findOne({ _id: req.body.from._id })

    Message.create(
      {
        _id: new mongoose.Types.ObjectId(),
        to: to._id,
        from: from._id,
        content: req.body.content
      },
      err => {
        if (err) return res.status(500).json(err)
        const messageToSend = {
          to: to,
          from: from,
          content: req.body.content
        }
        io.emit('message', messageToSend)
        return res.status(200).json(messageToSend)
      }
    )
  })

  app.get('/chat/message/:from/:to', (req, res) => {
    Message.find({
      from: req.params.from,
      to: req.params.to
    }, (err, messages) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(messages)
    })
  })
}
