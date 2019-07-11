const mongoose = require('mongoose')
const Status = require('../../models/ticket/Status')

module.exports = app => {
  app.get('/status', (req, res) => {
    Status.find({}, (err, status) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(status)
    })
  })

  app.post('/config/status', (req, res) => {
    const status = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    Status.create(status, err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(200)
    })
  })
}
