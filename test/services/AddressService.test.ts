import AddressService from '../../server/services/AddressService'
import Address from '../../server/models/Address'

describe('Address', function() {
  this.timeout(0)

  it('Get all addresses', async () => {
    await AddressService.getAll()
  })

  it('Create new address', async () => {
    const address = new Address({
      name: 'test address',
      street: 'test street',
      city: 'test city',
      state: 'test state',
      country: 'test country'
    })

    await AddressService.create(address)
  })

  it('Edit address', async () => {
    const address = await Address.findOne().exec()
    address.name = 'test name'
    await AddressService.edit(address._id, address)
  })

  it('Find one', async () => {
    const address = await Address.findOne().exec()
    await AddressService.getOne(address._id)
  })
})
