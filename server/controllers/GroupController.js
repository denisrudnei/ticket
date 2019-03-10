const mongoose = require('mongoose')
const Group = require('../models/Group')

module.exports = app => {
  app.get('/group', (req, res) => {
    Group.find({}, (err, groups) => {
      if (err || groups === null) return res.status(500).json(err)
      return res.status(200).json(groups)
    })
  })

  app.post('/group', (req, res) => {
    const group = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    Group.create(group, err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(200)
    })
  })
}
