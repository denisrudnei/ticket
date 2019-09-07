const AddressService = require('../services/AddressService')

module.exports = app => {
  app.post('/address', async (req, res) => {
    AddressService.create(req.body).then(() => {
      return res.sendStatus(200)
    })
  })

  app.get('/address', (req, res) => {
    AddressService.getAll().then(addresses => {
      return res.status(200).json(addresses)
    })
  })

  app.get('/address/:id', (req, res) => {
    AddressService.getOne(req.params.id).then(address => {
      return res.status(200).json(address)
    })
  })

  app.put('/address/:id', (req, res) => {
    AddressService.edit(req.params.id, req.body).then(() => {
      res.sendStatus(202)
    })
  })
}
