const mongoose = require('mongoose')
const Ticket = require('../models/Ticket')
const Group = require('../models/Group')
const Status = require('../models/Status')
const Notification = require('../models/Notification')

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    Ticket.find({}).populate([
      'openedBy',
      'actualUser',
      'status',
      'group',
      'category'
    ]).exec((err, tickets) => {
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
      io.emit('addTicket', ticket)
      return res.status(200).json(result)
    })
  })

  app.post('/ticket/transfer/:id', async (req, res) => {
    const ticket = await Ticket.findOne({ _id: req.params.id }).populate([
      'group',
      'status',
      'openedBy',
      'actualUser',
      'category',
    ]).exec()

    const group = await Group.findOne({ _id: req.body._id })

    ticket.group = group._id

    const newTicket = {
      ...ticket._doc,
      group: group
    }

    ticket.save((err) => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', newTicket)
      return res.status(200).json(newTicket)
    })
  })

  app.post('/ticket/updateStatus/:id', async (req, res) => {
    const ticket = await Ticket.findOne({ _id: req.params.id }).populate([
      'group',
      'status',
      'openedBy',
      'actualUser',
      'category',
    ]).exec()

    const status = await Status.findOne({ _id: req.body._id })

    ticket.status = status._id

    const newTicket = {
      ...ticket._doc,
      status: status
    }

    ticket.save((err) => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', newTicket)
      return res.status(200).json(newTicket)
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
      Object.assign(ticket, req.body)
      ticket.save()
      res.sendStatus(200)
    })
  })
}
