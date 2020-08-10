import Address from '../models/Address';

class AddressService {
  static async create(address: Address): Promise<Address> {
    return Address.create(address).save();
  }

  static async getAll(): Promise<Address[]> {
    return Address.find();
  }

  static async getOne(addressId: Address['id']): Promise<Address> {
    const address = await Address.findOne(addressId);
    if (!address) throw new Error('Address not found');
    return address;
  }

  static async edit(addressId: Address['id'], addressToEdit: Address): Promise<Address> {
    const address = await Address.findOne(addressId);
    Object.assign(address, addressToEdit);
    return address!.save();
  }
}

export default AddressService;
