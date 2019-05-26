const mongoose = require('mongoose')
const Message = require('../models/chat/Message')
const Analyst = require('../models/Analyst')

module.exports = (app, io) => {
  app.post('/chat/message', async (req, res) => {
    const to = await Analyst.findOne({ _id: req.body.to._id })
    const from = await Analyst.findOne({ _id: req.session.authUser._id })

    Message.create(
      {
        _id: new mongoose.Types.ObjectId(),
        to: to._id,
        from: from._id,
        data: new Date(),
        content: req.body.content
      },
      err => {
        if (err) return res.status(500).json(err)
        const messageToSend = {
          to: to,
          from: from,
          content: req.body.content
        }
        io.emit(`message/${req.body.to._id}`, req.body)
        return res.status(200).json(messageToSend)
      }
    )
  })

  app.get('/chat/message/:user', (req, res) => {
    Message.find({
      $or: [
        {
          from: req.session.authUser._id,
          to: req.params.user
        },
        {
          from: req.params.user,
          to: req.session.authUser._id
        }
      ]
    })
      .populate([
        {
          path: 'to',
          select: {
            password: 0
          }
        },
        {
          path: 'from',
          select: {
            password: 0
          }
        }
      ])
      .exec((err, messages) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(messages)
      })
  })
}
