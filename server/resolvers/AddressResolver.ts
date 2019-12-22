import AddressService from '../services/AddressService'
import {IResolvers} from 'graphql-tools'

const AddressResolver: IResolvers =  {
  Query:  {
    Address: () => {
      return AddressService.getAll()
    }
  }
}


export default AddressResolver
