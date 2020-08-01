import AddressService from '../../server/services/AddressService';
import Address from '../../server/models/Address';

describe('Address', () => {
  it('Get all addresses', () => AddressService.getAll());

  it('Create new address', async () => {
    const address = new Address();
    address.cep = '0000000';
    address.name = 'test address';
    address.street = 'test street';
    address.city = 'test city';
    address.state = 'test state';
    address.country = 'test country';

    await AddressService.create(address);
  });

  it('Edit address', async () => {
    const address = await Address.findOne();
    address!.name = 'test name';
    await AddressService.edit(address!.id, address!);
  });

  it('Find one', async () => {
    const address = await Address.findOne();
    await AddressService.getOne(address!.id);
  });
});
