/* eslint-disable class-methods-use-this */
import {
  Authorized, Query, Resolver, Mutation, Arg, ID,
} from 'type-graphql';
import Address from '../models/Address';
import AddressService from '../services/AddressService';
import AddressCreateInput from '../inputs/AddressCreateInput';
import AddressInput from '../inputs/AddressInput';

@Resolver()
class AddressResolver {
  @Query(() => [Address])
  @Authorized('user')
  Address() {
    return AddressService.getAll();
  }

  @Query(() => Address)
  @Authorized('user')
  AddressById(@Arg('id', () => ID) id: Address['id']): Promise<Address> {
    return AddressService.getOne(id);
  }

  @Mutation(() => Address)
  @Authorized('user')
  CreateAddress(
    @Arg('address', () => AddressCreateInput) address: Address,
  ): Promise<Address> {
    return AddressService.create(address);
  }

  @Mutation(() => Address)
  @Authorized('user')
  EditAddress(
    @Arg('id', () => ID) id: Address['id'],
    @Arg('address', () => AddressInput) address: Address,
  ): Promise<Address> {
    return AddressService.edit(id, address);
  }
}

export default AddressResolver;
