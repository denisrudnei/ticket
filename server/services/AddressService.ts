import mongoose from 'mongoose'
import Address, {IAddress} from '../models/Address'

class AddressService {
  create(address: IAddress): Promise<void> {
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
        (err: Error) => {
          if (err) return reject
          return resolve()
        }
      )
    })
  }
  getAll() {
    return new Promise((resolve, reject) => {
      Address.find().exec((err: Error, addresses) => {
        if (err) return reject(err)
        return resolve(addresses)
      })
    })
  }
  getOne(addressId: IAddress['_id']): Promise<IAddress> {
    return new Promise((resolve, reject) => {
      Address.findOne({
        _id: addressId
      }).exec((err: Error, address) => {
        if (err) return reject(err)
        return resolve(address)
      })
    })
  }
  edit(addressId: IAddress['_id'], address: IAddress): Promise<void> {
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
      ).exec((err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}

export default new AddressService()
