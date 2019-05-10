const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator/check')
const S3 = require('../../plugins/S3')
const Ticket = require('../models/Ticket')
const Group = require('../models/Group')
const Status = require('../models/Status')
const Notification = require('../models/Notification')

const populateArray = [
  {
    path: 'openedBy',
    select: {
      name: 1,
      picture: 1,
      email: 1
    }
  },
  {
    path: 'actualUser',
    select: {
      name: 1,
      picture: 1,
      email: 1
    }
  },
  {
    path: 'logs',
    select: {
      date: 1,
      oldStatus: 1,
      group: 1,
      user: 1
    }
  },
  'status',
  'group',
  'category'
]

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    Ticket.find({})
      .populate(populateArray)
      .exec((err, tickets) => {
        if (err || tickets === null) return res.status(500).json(err)
        return res.status(200).json(tickets)
      })
  })

  app.post(
    '/ticket',
    [
      body('openedBy', 'Preencha o analista').exists(),
      body('actualUser', 'Preencha o usuário atual').exists(),
      body('group', 'Preencha um grupo').exists(),
      body('status', 'Preencha um status').exists(),
      body('resume').exists(),
      body('content').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json(errors.mapped())

      const ticket = {
        _id: new mongoose.Types.ObjectId(),
        ...req.body
      }

      const notification = await Notification.create({
        _id: new mongoose.Types.ObjectId(),
        name: 'TicketCreate',
        from: ticket.openedBy._id,
        to: ticket.group.analysts.map(a => a._id),
        content: `${ticket.openedBy.name} abriu um novo chamado`
      })

      Ticket.create(ticket, async (err, result) => {
        if (err) return res.status(500).json(err)
        const newTicket = await Ticket.findOne({ _id: result._id }).populate(
          populateArray
        )
        io.emit(`notification/${ticket.group._id}`, notification)
        io.emit('addTicket', newTicket)
        return res.status(200).json(newTicket)
      })
    }
  )

  app.post('/ticket/transfer/:id', async (req, res) => {
    const ticket = await Ticket.findOne({ _id: req.params.id })
      .populate(populateArray)
      .exec()

    const group = await Group.findOne({ _id: req.body._id })

    ticket.group = group._id

    const newTicket = {
      ...ticket._doc,
      group: group
    }

    const notification = await Notification.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'TicketTransfer',
      from: ticket.openedBy._id,
      to: group.analysts.map(a => a._id),
      content: `${ticket.openedBy.name} transferiu um chamado para seu grupo`
    })

    ticket.save(err => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', newTicket)
      io.emit(`notification/${group._id}`, notification)
      return res.status(200).json(newTicket)
    })
  })

  app.post('/ticket/updateStatus/:id', async (req, res) => {
    const ticket = await Ticket.findOne({ _id: req.params.id })
      .populate(populateArray)
      .exec()

    const status = await Status.findOne({ _id: req.body._id })

    ticket.status = status._id

    const newTicket = {
      ...ticket._doc,
      status: status
    }

    ticket.save(err => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', newTicket)
      return res.status(200).json(newTicket)
    })
  })

  app.get('/ticket/:id', (req, res) => {
    Ticket.findOne({
      _id: req.params.id
    })
      .populate(populateArray)
      .exec((err, ticket) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(ticket)
      })
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

  app.get('/ticket/:id/file', (req, res) => {
    S3.getObject(
      {
        Bucket: process.env.BUCKET,
        Key: req.params.id
      },
      (err, file) => {
        if (err) return res.status(500).json(err)
        return res.end(file.Body)
      }
    )
  })

  app.delete('/ticket/:ticket/:file/file', async (req, res) => {
    const ticket = await Ticket.findOne({
      _id: req.params.ticket
    })
    S3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: req.params.file
      },
      err => {
        if (err) return res.status(500).json(err)
        ticket.files = ticket.files.filter(f => {
          return f.name !== req.params.file
        })
        ticket.save()
        return res.sendStatus(200)
      }
    )
  })

  app.post('/ticket/:id/file', async (req, res) => {
    const files = Object.values(req.files)
    const ticket = await Ticket.findOne({
      _id: req.params.id
    })
    files.forEach(async (f, index) => {
      await S3.createBucket(async () => {
        const name = `${req.params.id} - ${f.name} - ${index}`
        const params = {
          Bucket: process.env.BUCKET,
          Key: name,
          Body: f.data
        }
        await S3.upload(params, (err, data) => {
          if (err) return res.status(400).json(err)
          ticket.files.push({
            name: name,
            type: f.mimetype
          })
          ticket.save()
        })
      })
    })
    return res.status(200).json(ticket.files)
  })
}
