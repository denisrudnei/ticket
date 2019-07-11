const { body, param, validationResult } = require('express-validator/check')
const TicketService = require('../../services/ticket/TicketService')

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    let sortBy = req.query.sortBy || 'created'
    const descending = parseInt(req.query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    TicketService.getTickets(sortBy, page, limit, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
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

      await TicketService.create(req.body, (err, result) => {
        if (err) return res.status(500).json(err)
        io.emit(`notification/${req.ticket.group._id}`, result.notification)
        io.emit('addTicket', result.newTicket)
        return res.status(200).json(result.newTicket)
      })
    }
  )

  app.post('/ticket/transfer/:id', (req, res) => {
    TicketService.transferToGroup(
      req.params.id,
      req.body._id,
      (err, result) => {
        if (err) return res.status(500).json(err)
        io.emit('updateTicket', result.newTicket)
        io.emit(`notification/${req.body._id}`, result.notification)
        return res.status(200).json(result.newTicket)
      }
    )
  })

  app.post('/ticket/updateStatus/:id', async (req, res) => {
    await TicketService.changeStatus(
      req.params.id,
      req.body._id,
      (err, result) => {
        if (err) return res.status(500).json(err)
        io.emit('updateTicket', result)
        return res.status(200).json(result)
      }
    )
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
      const userId = req.session.authUser._id
      TicketService.commentOnTicket(
        req.params.id,
        userId,
        req.body.content,
        (err, result) => {
          if (err) return res.status(500).json(err)
          io.emit('updateTicket', result)
          return res.status(201).json(result)
        }
      )
    }
  )

  app.get('/ticket/:id', (req, res) => {
    TicketService.getOne(req.params.id, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.put('/ticket/:id', (req, res) => {
    TicketService.updateOne(req.params.id, req.body, (err, result) => {
      if (err) return res.status(500).json(err)
      io.emit('updateTicket', result)
      res.sendStatus(202)
    })
  })

  app.get('/ticket/:id/file', (req, res) => {
    TicketService.getFile(req.params.id, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.end(result)
    })
  })

  app.delete('/ticket/:ticket/:file/file', async (req, res) => {
    await TicketService.removeFile(
      req.params.ticket,
      req.params.file,
      (err, _) => {
        if (err) return res.status(500).json(err)
        return res.sendStatus(201)
      }
    )
  })

  app.post('/ticket/:id/file', async (req, res) => {
    const files = Object.values(req.files)
    await TicketService.insertFile(req.params.id, files, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })
}
