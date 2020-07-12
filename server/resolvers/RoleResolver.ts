import {
  Authorized,
  Query,
  Resolver,
  Ctx,
  Mutation,
  Arg,
  ID
} from 'type-graphql'

import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import Role from '../models/Role'
import RoleService from '../services/RoleService'
import RoleInput from '../inputs/RoleInput'
import Analyst from '../models/Analyst'

@Resolver()
class RoleResolver {
  @Query(() => [Role])
  @Authorized('user')
  Role() {
    return RoleService.getRoles()
  }

  @Query(() => Role)
  @Authorized('user')
  RoleById(@Arg('id', () => ID) id: Role['id']) {
    return RoleService.getOne(id)
  }

  @Mutation(() => Role)
  @Authorized('admin')
  EditRole(
    @Arg('roleId', () => ID) roleId: Role['id'],
    @Arg('role', () => RoleInput) role: Role
  ): Promise<Role> {
    return new Promise((resolve, reject) => {
      RoleService.updateRole(roleId, role).then(role => {
        resolve(role)
      })
    })
  }

  @Mutation(() => Boolean)
  @Authorized('admin')
  UpdateRole(
    @Arg('userId', () => ID) userId: Analyst['id'],
    @Arg('roleId', () => ID) roleId: Role['id'],
    @Ctx() context: ExpressContext
  ) {
    return RoleService.setAnalystRole(userId, roleId)
  }
}

export default RoleResolver
