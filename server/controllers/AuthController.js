const jsonwebtoken = require('jsonwebtoken')
const AuthService = require('../services/AuthService')

module.exports = {
  login: (req, res) => {
    AuthService.login(req.body.email, req.body.password)
      .then(result => {
        req.session.authUser = result
        const response = jsonwebtoken.sign(
          JSON.stringify(result),
          process.env.JWT_TOKEN
        )
        return res.json({
          user: response
        })
      })
      .catch(() => {
        return res.sendStatus(400)
      })
  },

  getUser: (req, res) => {
    res.json({
      user: req.session.authUser
    })
  },

  logout: (req, res) => {
    delete req.session.authUser
    res.sendStatus(200)
  },

  register: (req, res, next) => {
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
  },

  mergeUser: (req, res, next) => {
    AuthService.mergeUser(req.body.email, req.body)
      .then(result => {
        req.session.authUser = result
        return res.status(200).json(result)
      })
      .catch(e => {
        next(e)
      })
  },

  redefinePassword: (req, res) => {
    const user = req.body
    AuthService.generateEmailToReset(user.email, req)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(err => {
        return res.status(500).json(err)
      })
  },

  resetWithToken: (req, res) => {
    const user = req.body
    const token = req.params.token
    AuthService.resetPasswordWithToken(token, user.password)
      .then(() => {
        return res.sendStatus(200)
      })
      .catch(err => {
        return res.status(500).json(err)
      })
  },

  reset: (req, res) => {
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
  }
}
