const mongoose = require('mongoose')
const { body, param, validationResult } = require('express-validator/check')
const S3 = require('../../plugins/S3')
const Ticket = require('../models/Ticket')
const Group = require('../models/Group')
const Status = require('../models/Status')
const Notification = require('../models/Notification')
const Comment = require('../models/Comment')

const populateArray = [
  {
    path: 'openedBy'
  },
  {
    path: 'actualUser'
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
  {
    path: 'comments',
    select: {
      date: 1,
      content: 1,
      user: 1
    }
  },
  'status',
  'group',
  'category'
]

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    Ticket.paginate(
      {},
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        populate: 'logs comments'
      },
      (err, result) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json(result)
      }
    )
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

  app.post(
    '/ticket/comment/:id',
    [
      body('content', 'Preencha o comentário').exists(),
      param('id', 'Precisa de um id').exists()
    ],
    (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json(errors.mapped())

      Ticket.findOne({
        _id: req.params.id
      })
        .populate(populateArray)
        .exec(async (err, ticket) => {
          if (err) return res.status(500).json(err)
          if (!ticket) return res.sendStatus(404)

          const comment = await Comment.create({
            _id: new mongoose.Types.ObjectId(),
            user: req.session.authUser._id,
            content: req.body.content
          })
          ticket.comments.push(comment)
          ticket.save(async err => {
            if (err) return res.status(500).json(err)
            const newTicket = await Ticket.findOne({
              _id: req.params.id
            }).populate(populateArray)
            io.emit('updateTicket', newTicket)
            return res.sendStatus(202)
          })
        })
    }
  )

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
    Ticket.updateOne(
      {
        _id: req.params.id
      },
      {
        $set: {
          status: req.body.status._id,
          group: req.body.group._id,
          resume: req.body.resume,
          content: req.body.content,
          category: req.body.category._id,
          actualUser: req.body.actualUser._id
        }
      }
    ).exec(err => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', req.body)
      res.sendStatus(202)
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
