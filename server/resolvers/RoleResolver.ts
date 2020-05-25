import { Resolver, Query, Authorized } from 'type-graphql'
import RoleService from '../services/RoleService'
import Role from '../models/Role'

@Resolver()
class RoleResolver {
  @Query(() => [Role])
  @Authorized('user')
  Role() {
    return RoleService.getRoles()
  }
}

export default RoleResolver
