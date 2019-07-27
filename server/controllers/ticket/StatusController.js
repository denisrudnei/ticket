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

  app.post('/config/status', (req, res) => {
    StatusService.create(req.body)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
