const mongoose = require('mongoose')
const Address = require('../models/Address')
const Analyst = require('../models/Analyst')

module.exports = app => {
  app.post('/address', async (req, res) => {
    const user = await Analyst.findOne({
      _id: req.session.authUser._id
    })
    const userAddress = await Address.findOne({
      _id: user.address._id
    })
    const { cep, city, state, street } = req.body
    if (userAddress) {
      userAddress.cep = cep
      userAddress.city = city
      userAddress.state = state
      user.address = userAddress
      userAddress.save()
      user.save(err => {
        if (err) return res.status(500).json(err)
      })
    } else {
      Address.create(
        {
          _id: new mongoose.Types.ObjectId(),
          cep: cep,
          city: city,
          street: street,
          state: state
        },
        (err, address) => {
          if (err) return res.status(500).json(err)
          user.address = address
          user.save()
        }
      )
    }
    return res.sendStatus(200)
  })

  app.get('/address', (req, res) => {
    Address.find().exec((err, address) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(address)
    })
  })
}
