const mongoose = require('mongoose')
const Address = require('../models/Address')

module.exports = app => {
  app.post('/address', async (req, res) => {
    const { name, cep, city, state, street } = req.body

    Address.create(
      {
        _id: new mongoose.Types.ObjectId(),
        name: name,
        cep: cep,
        city: city,
        street: street,
        state: state
      },
      err => {
        if (err) return res.status(500).json(err)
        return res.sendStatus(200)
      }
    )
  })

  app.get('/address', (req, res) => {
    Address.find().exec((err, address) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(address)
    })
  })

  app.get('/address/:id', (req, res) => {
    Address.findOne({
      _id: req.params.id
    }).exec((err, address) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(address)
    })
  })

  app.put('/address/:id', (req, res) => {
    const { name, cep, city, state, street } = req.body
    Address.updateOne(
      {
        _id: req.params.id
      },
      {
        $set: {
          name: name,
          cep,
          city,
          state,
          street
        }
      }
    ).exec(err => {
      if (err) return res.status(500).json(err)
      return res.sendStatus(202)
    })
  })
}
