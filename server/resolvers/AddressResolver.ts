import { IResolvers } from 'graphql-tools'
import AddressService from '../services/AddressService'

const AddressResolver: IResolvers = {
  Query: {
    Address: () => {
      return AddressService.getAll()
    }
  }
}

export default AddressResolver
