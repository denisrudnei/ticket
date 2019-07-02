const AnalystService = require('../services/AnalystService')

module.exports = app => {
  app.get('/analyst', (req, res) => {
    AnalystService.getAnalysts((err, analysts) => {
      if (err || analysts === null) return res.status(500).json(err)
      return res.status(200).json(analysts)
    })
  })

  app.get('/config/analyst', (_, res) => {
    AnalystService.getConfigAnalysts((err, analysts) => {
      if (err || analysts === null) return res.status(500).json(err)
      return res.status(200).json(analysts)
    })
  })

  app.post('/config/analyst', (req, res) => {
    AnalystService.create(req.body, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })

  app.post('/analyst/:id/groups', (req, res) => {
    const userId = req.params.id
    AnalystService.getGroups(userId, (err, groups) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(groups)
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
    AnalystService.updateAnalyst(userId, analyst, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })

  app.put('/analyst/image', (req, res) => {
    const userId = req.session.authUser._id
    const file = req.files.image
    AnalystService.updateImage(userId, file, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })

  app.delete('/analyst/image', (req, res) => {
    const userId = req.session.authUser._id
    AnalystService.removeImage(userId, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })

  app.delete('/analyst/:id', (req, res) => {
    const userId = req.params.id
    AnalystService.remove(userId, (err, _) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(200)
    })
  })
}
