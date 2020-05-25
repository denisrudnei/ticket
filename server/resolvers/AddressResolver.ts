import { Resolver, Query, Mutation, Authorized } from 'type-graphql'
import AddressService from '../services/AddressService'
import Address from '../models/Address'

@Resolver()
class AddressResolver {
  @Query(() => [Address])
  @Authorized('user')
  Address() {
    return AddressService.getAll()
  }
}

export default AddressResolver
