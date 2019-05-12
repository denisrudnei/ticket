const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.post('/auth/login', (req, res) => {
    Analyst.findOne({
      email: req.body.email
    })
      .select('+password')
      .exec((err, user) => {
        if (err || user === null) return res.sendStatus(400)
        user.verifyPassword(req.body.password, (err, result) => {
          if (err || !result) return res.sendStatus(400)
          req.session.authUser = user
          return res.json(user)
        })
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
    const user = await Analyst.findOne({
      email: req.body.email
    })
    if (user) {
      return res.status(400).json({
        message: 'Usuário já existe'
      })
    }
    Analyst.create(req.body, err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })

  app.post('/auth/mergeUser', (req, res) => {
    Analyst.findOne(
      {
        email: req.body.email
      },
      async (err, analyst) => {
        if (err || analyst === null) {
          await Analyst.create(
            {
              _id: new mongoose.Types.ObjectId(),
              ...req.body
            },
            (err, newAnalyst) => {
              if (err) return res.status(500).json(err)
              return res.status(200).json(newAnalyst)
            }
          )
        } else {
          analyst.picture = req.body.picture
          analyst.save()
          return res.status(200).json(analyst)
        }
      }
    )
  })

  app.post('/auth/password/reset', (req, res) => {
    Analyst.findOne({
      _id: req.session.authUser._id
    }).exec((err, user) => {
      if (err) return res.status(500).json(err)
      user.password = req.body.newPassword
      user.save()
      return res.sendStatus(201)
    })
  })
}
