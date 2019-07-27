const GroupService = require('../../services/ticket/GroupService')

module.exports = app => {
  app.get('/group', (req, res) => {
    GroupService.getAll()
      .then(groups => {
        return res.status(200).json(groups)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/config/group', (req, res) => {
    GroupService.create(req.body)
      .then(() => {
        res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/config/group/analyst/:groupId', (req, res) => {
    GroupService.insertAnalyst(req.params.groupId, req.body._id)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/config/group/analyst/:groupId/:analystId', (req, res) => {
    GroupService.removeAnalyst(req.params.groupId, req.params.analystId)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
