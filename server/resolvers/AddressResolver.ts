import { Authorized, Query, Resolver } from 'type-graphql'
import Address from '../models/Address'
import AddressService from '../services/AddressService'

@Resolver()
class AddressResolver {
  @Query(() => [Address])
  @Authorized('user')
  Address() {
    return AddressService.getAll()
  }
}

export default AddressResolver
