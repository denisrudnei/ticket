const AddressService = require('../services/AddressService')

const AddressResolver = {
  Query: {
    Address: () => {
      return AddressService.getAll()
    }
  }
}

module.exports = AddressResolver
