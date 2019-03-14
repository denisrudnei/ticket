const mongoose = require('mongoose')
const Ticket = require('../models/Ticket')
const Notification = require('../models/Notification')

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    Ticket.find({}, (err, tickets) => {
      if (err || tickets === null) return res.status(500).json(err)
      return res.status(200).json(tickets)
    })
  })

  app.post('/ticket', async (req, res) => {
    const ticket = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    const notification = await Notification.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'TicketCreate',
      from: ticket.actualUser._id,
      to: [ticket.actualUser._id],
      content: 'Criado novo ticket'
    })

    Ticket.create(ticket, (err, result) => {
      if (err) return res.status(500).json(err)
      io.emit('notification', notification)
      return res.status(200).json(result)
    })
  })

  app.get('/ticket/:id', (req, res) => {
    Ticket.findOne(
      {
        _id: req.params.id
      },
      (err, tickets) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(tickets)
      }
    )
  })

  app.put('/ticket/:id', (req, res) => {
    Ticket.findOne({
      _id: req.params.id
    }).exec((err, ticket) => {
      if (err) return res.status(500).json(err)
      console.log(ticket)
      Object.assign(ticket, req.body)
      ticket.save()
      res.sendStatus(200)
    })
  })
}
