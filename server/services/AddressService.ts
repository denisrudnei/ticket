import Address from '../models/Address'

class AddressService {
  create(address: Address): Promise<Address> {
    return new Promise((resolve, reject) => {
      Address.create(address)
        .save()
        .then(() => {
          return resolve(address)
        })
    })
  }

  getAll(): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      Address.find().then(addresses => {
        return resolve(addresses)
      })
    })
  }

  getOne(addressId: Address['id']): Promise<Address> {
    return new Promise((resolve, reject) => {
      Address.findOne(addressId).then(address => {
        return resolve(address)
      })
    })
  }

  edit(addressId: Address['id'], addressToEdit: Address): Promise<Address> {
    return new Promise((resolve, reject) => {
      Address.findOne(addressId).then(address => {
        Object.assign(address, addressToEdit)
        address!.save().then(address => {
          resolve(address)
        })
      })
    })
  }
}

export default new AddressService()
