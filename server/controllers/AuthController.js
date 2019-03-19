const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.post('/auth/login', (req, res) => {
    // NOT WORKING
    // https://github.com/nuxt-community/auth-module/issues/286#issuecomment-473110121
    req.session.authUser = { username: 'teste@teste.com' }
    return res.status(200).json({ username: 'teste@teste.com' })
  })

  app.post('/auth/logout', (req, res) => {
    delete req.session.authUser
    res.json({ ok: true })
  })

  app.post('/auth/mergeUser', async (req, res) => {
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
}
