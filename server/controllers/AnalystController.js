const mongoose = require('mongoose')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.get('/analyst', (req, res) => {
    Analyst.find({}, (err, analysts) => {
      if (err || analysts === null) return res.status(500).json(err)
      return res.status(200).json(analysts)
    })
  })

  app.post('/analyst', (req, res) => {
    const analyst = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    }

    Analyst.create(analyst, (err, result) => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(200)
    })
  })

  app.delete('/analyst/:id', (req, res) => {
    Analyst.findOneAndDelete(
      {
        _id: req.params.id
      },
      (err, result) => {
        if (err) return res.status(500).json(err)
        return res.sendStatus(200)
      }
    )
  })
}
