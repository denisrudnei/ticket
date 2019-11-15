const AddressService = require('../services/AddressService')

module.exports = {
  create: async (req, res) => {
    AddressService.create(req.body).then(() => {
      return res.sendStatus(200)
    })
  },

  getAll: (req, res) => {
    AddressService.getAll().then(addresses => {
      return res.status(200).json(addresses)
    })
  },

  getOne: (req, res) => {
    AddressService.getOne(req.params.id).then(address => {
      return res.status(200).json(address)
    })
  },

  edit: (req, res) => {
    AddressService.edit(req.params.id, req.body).then(() => {
      res.sendStatus(202)
    })
  }
}
