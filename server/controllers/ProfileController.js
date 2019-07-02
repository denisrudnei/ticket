const PathService = require('../services/PathService')

module.exports = (app, io) => {
  app.get('/profile', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getProfileInfo(userId, (_, result) => {
      return res.status(200).json(result)
    })
  })

  app.get('/info/path/refs', (_, res) => {
    PathService.getRefs((_, result) => {
      return res.status(200).json(result)
    })
  })

  app.post('/info/path', (req, res) => {
    const path = {
      name: req.body.name,
      path: req.body.path,
      group: req.body.group
    }
    const userId = req.session.authUser._id
    PathService.create(path, userId, err => {
      if (err) return res.status(500).json(err)
      io.emit('paths/updatePath')
      return res.sendStatus(201)
    })
  })

  app.get('/info/path', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getPaths(userId, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.get('/profile/address', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getAddress(userId, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(result)
    })
  })

  app.delete('/info/path/:id', (req, res) => {
    PathService.remove(req.params.id, err => {
      if (err) return res.status(500).json(err)
      io.emit('paths/updatePath')
      return res.sendStatus(202)
    })
  })
}
