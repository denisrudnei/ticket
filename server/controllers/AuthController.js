const AuthService = require('../services/AuthService')

module.exports = app => {
  app.post('/auth/login', (req, res) => {
    AuthService.login(req.body.email, req.body.password)
      .then(result => {
        req.session.authUser = result
        return res.json(result)
      })
      .catch(() => {
        return res.sendStatus(400)
      })
  })

  app.post('/auth/user', (req, res) => {
    res.json({
      user: req.session.authUser
    })
  })

  app.post('/auth/logout', (req, res) => {
    delete req.session.authUser
    res.sendStatus(200)
  })

  app.post('/auth/register', (req, res, next) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    AuthService.register(user)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(next)
  })

  app.post('/auth/mergeUser', (req, res, next) => {
    AuthService.mergeUser(req.body.email, req.body)
      .then(result => {
        req.session.authUser = result
        return res.status(200).json(result)
      })
      .catch(e => {
        next(e)
      })
  })

  app.post('/auth/redefine', (req, res) => {
    const user = req.body
    AuthService.generateEmailToReset(user.email, req)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(err => {
        return res.status(500).json(err)
      })
  })

  app.post('/auth/password/reset', (req, res) => {
    const userId = req.session.authUser._id
    AuthService.resetPassword(
      userId,
      req.body.oldPassword,
      req.body.newPassword
    )
      .then(() => {
        return res.sendStatus(201)
      })
      .catch(e => {
        return res.status(400).json({
          message: 'Senha antiga errada'
        })
      })
  })
}
