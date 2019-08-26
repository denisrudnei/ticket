const StatusService = require('../../services/ticket/StatusService')

module.exports = app => {
  app.get('/status', (req, res) => {
    StatusService.getStatus()
      .then(status => {
        return res.status(200).json(status)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/status/:id', (req, res) => {
    StatusService.getOne(req.params.id)
      .then(status => {
        return res.status(200).json(status)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/config/status', (req, res) => {
    StatusService.create(req.body)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/config/status/:id', (req, res) => {
    StatusService.edit(req.params.id, req.body)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
