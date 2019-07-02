const AuthService = require('../services/AuthService')

module.exports = app => {
  app.post('/auth/login', (req, res) => {
    AuthService.login(req.body.email, req.body.password, (err, result) => {
      if (err || !result) return res.sendStatus(400)
      req.session.authUser = result
      return res.json(result)
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

  app.post('/auth/register', async (req, res) => {
    await AuthService.register(req.body.email, req.body.password, err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })

  app.post('/auth/mergeUser', (req, res) => {
    AuthService.mergeUser(req.body.email, req.body, (err, result) => {
      if (err) return res.status(500).json(err)
      req.session.authUser = result
      return res.status(200).json(result)
    })
  })

  app.post('/auth/password/reset', (req, res) => {
    const userId = req.session.authUser._id
    AuthService.resetPassword(
      userId,
      req.body.oldPassword,
      req.body.newPassword,
      (err, _) => {
        if (err)
          return res.status(400).json({
            message: 'Senha antiga errada'
          })
        return res.sendStatus(201)
      }
    )
  })
}
