const mongoose = require('mongoose')
const Address = require('../models/Address')

const AddressService = {
  create(address) {
    return new Promise((resolve, reject) => {
      const { name, country, cep, city, state, street } = address

      Address.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name,
          country,
          cep,
          city,
          street,
          state
        },
        err => {
          if (err) return reject
          return resolve()
        }
      )
    })
  },
  getAll() {
    return new Promise((resolve, reject) => {
      Address.find().exec((err, addresses) => {
        if (err) return reject(err)
        return resolve(addresses)
      })
    })
  },
  getOne(addressId) {
    return new Promise((resolve, reject) => {
      Address.findOne({
        _id: addressId
      }).exec((err, address) => {
        if (err) return reject(err)
        return resolve(address)
      })
    })
  },
  edit(addressId, address) {
    return new Promise((resolve, reject) => {
      const { name, country, cep, city, state, street } = address
      Address.updateOne(
        {
          _id: addressId
        },
        {
          $set: {
            name,
            country,
            cep,
            city,
            state,
            street
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

module.exports = AddressService
