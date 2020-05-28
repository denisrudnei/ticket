import { Authorized, Query, Resolver } from 'type-graphql'

import Role from '../models/Role'
import RoleService from '../services/RoleService'

@Resolver()
class RoleResolver {
  @Query(() => [Role])
  @Authorized('user')
  Role() {
    return RoleService.getRoles()
  }
}

export default RoleResolver
