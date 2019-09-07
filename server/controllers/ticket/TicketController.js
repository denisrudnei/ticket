const { body, param, validationResult } = require('express-validator')
const TicketService = require('../../services/ticket/TicketService')

module.exports = (app, io) => {
  app.get('/ticket', (req, res) => {
    let sortBy = req.query.sortBy || 'created'
    const descending = parseInt(req.query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    TicketService.getAll(sortBy, page, limit)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/ticket/profile/:type', (req, res) => {
    const type = req.params.type
    let sortBy = req.query.sortBy || 'created'
    const descending = parseInt(req.query.descending) || -1
    sortBy = {
      [sortBy]: descending
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const actualUser = req.session.authUser._id

    TicketService.getTickets(
      {
        [type]: actualUser
      },
      sortBy,
      page,
      limit
    )
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
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
    (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json(errors.mapped())

      TicketService.create(req.body)
        .then(result => {
          io.emit(`notification/${req.body.group._id}`, result.notification)
          io.emit('addTicket', result.newTicket)
          return res.status(200).json(result.newTicket)
        })
        .catch(e => {
          return res.status(500).json(e)
        })
    }
  )

  app.post('/ticket/transfer/:id', (req, res) => {
    TicketService.transferToGroup(
      req.params.id,
      req.body._id,
      req.session.authUser
    )
      .then(result => {
        io.emit('updateTicket', result.newTicket)
        io.emit(`notification/${req.body._id}`, result.notification)
        return res.status(200).json(result.newTicket)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/ticket/updateStatus/:id', async (req, res) => {
    await TicketService.changeStatus(req.params.id, req.body._id)
      .then(result => {
        io.emit('updateTicket', result)
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
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
      const userId = req.session.authUser._id
      TicketService.commentOnTicket(req.params.id, userId, req.body.content)
        .then(result => {
          io.emit('updateTicket', result)
          return res.status(201).json(result)
        })
        .catch(e => {
          return res.status(500).json(e)
        })
    }
  )

  app.get('/ticket/:id', (req, res) => {
    TicketService.getOne(req.params.id)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/ticket/:id', (req, res) => {
    TicketService.updateOne(req.params.id, req.body)
      .then(result => {
        io.emit('updateTicket', result)
        res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/ticket/:id/file', (req, res) => {
    TicketService.getFile(req.params.id)
      .then(result => {
        return res.end(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/ticket/:ticket/:file/file', async (req, res) => {
    await TicketService.removeFile(req.params.ticket, req.params.file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/ticket/:id/file', async (req, res) => {
    const files = Object.values(req.files)
    await TicketService.insertFile(req.params.id, files)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
