const AnalystService = require('../services/AnalystService')

module.exports = app => {
  app.get('/analyst', (req, res) => {
    AnalystService.getAnalysts()
      .then(analysts => {
        return res.status(200).json(analysts)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/config/analyst', (_, res) => {
    AnalystService.getConfigAnalysts()
      .then(analysts => {
        return res.status(200).json(analysts)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/config/analyst', (req, res) => {
    AnalystService.create(req.body)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.post('/analyst/:id/groups', (req, res) => {
    const userId = req.params.id
    AnalystService.getGroups(userId)
      .then(groups => {
        return res.status(200).json(groups)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/analyst', (req, res) => {
    const userId = req.session.authUser._id
    const analyst = {
      name: req.body.name,
      contactEmail: req.body.contactEmail,
      color: req.body.color,
      mergePictureWithExternalAccount: req.body.mergePictureWithExternalAccount
    }
    AnalystService.updateAnalyst(userId, analyst)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.put('/analyst/image', (req, res) => {
    const userId = req.session.authUser._id
    const file = req.files.image
    AnalystService.updateImage(userId, file)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/analyst/image', (req, res) => {
    const userId = req.session.authUser._id
    AnalystService.removeImage(userId)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/analyst/:id', (req, res) => {
    const userId = req.params.id
    AnalystService.remove(userId)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
