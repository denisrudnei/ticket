const PathService = require('../services/PathService')

module.exports = (app, io) => {
  app.get('/profile', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getProfileInfo(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        res.status(500).json(e)
      })
  })

  app.get('/info/path/refs', (_, res) => {
    PathService.getRefs().then(result => {
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
    PathService.create(path, userId)
      .then(() => {
        io.emit('paths/updatePath')
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/info/path', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getPaths(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.get('/profile/address', (req, res) => {
    const userId = req.session.authUser._id
    PathService.getAddress(userId)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })

  app.delete('/info/path/:id', (req, res) => {
    PathService.remove(req.params.id)
      .then(() => {
        io.emit('paths/updatePath')
        return res.sendStatus(202)
      })
      .catch(e => {
        return res.status(500).json(e)
      })
  })
}
