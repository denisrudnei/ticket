import Address from '../models/Address';

class AddressService {
  static async create(address: Address): Promise<Address> {
    return Address.create(address).save();
  }

  static getAll(): Promise<Address[]> {
    return new Promise((resolve, reject) => {
      Address.find().then((addresses) => resolve(addresses));
    });
  }

  static getOne(addressId: Address['id']): Promise<Address> {
    return new Promise((resolve, reject) => {
      Address.findOne(addressId).then((address) => resolve(address));
    });
  }

  static async edit(addressId: Address['id'], addressToEdit: Address): Promise<Address> {
    const address = await Address.findOne(addressId);
    Object.assign(address, addressToEdit);
    return address!.save();
  }
}

export default AddressService;
