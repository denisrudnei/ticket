import faker from 'faker'
import { DeleteResult } from 'typeorm'
import Address from '../../server/models/Address'
import Generate from './Generate'

import Seed from './Seed'

class AddressSeed implements Seed<Address> {
  init(): Promise<Address> {
    const address = new Address()
    address.cep = '00000'
    address.name = 'Test address'
    address.city = faker.address.city()
    address.state = faker.address.state()
    address.country = faker.address.country()
    address.street = faker.address.streetName()
    return address.save()
  }

  generateMany(number: number): Promise<Address[]> {
    return Generate.many<AddressSeed>(new AddressSeed(), number)
  }

  destroy(): Promise<DeleteResult> {
    return Address.delete({})
  }
}

export default AddressSeed
