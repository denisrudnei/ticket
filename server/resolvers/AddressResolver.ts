import AddressService from '../services/AddressService'

const AddressResolver = {
  Query: {
    Address: () => {
      return AddressService.getAll()
    }
  }
}

export default AddressResolver
