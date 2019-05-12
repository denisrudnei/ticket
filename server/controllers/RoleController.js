const Role = require('../models/Role')
const CheckACL = require('../models/CheckACL')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.get('/role', (req, res) => {
    CheckACL.checkDb(err => {
      if (err) return res.status(500).json(err)
    })
    Role.find({}).exec((err, roles) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(roles)
    })
  })

  app.put('/role/:id', (req, res) => {
    Role.updateOne(
      {
        _id: req.params.id
      },
      {
        $set: {
          description: req.body.description
        }
      }
    ).exec(err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })

  app.post('/role/:id', (req, res) => {
    Analyst.updateOne(
      {
        _id: req.params.id
      },
      {
        $set: {
          role: req.body.name
        }
      }
    ).exec(err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(201)
    })
  })
}
