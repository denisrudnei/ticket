import { Authorized, FieldResolver, Query, Resolver, Root } from 'type-graphql'

import Analyst from '../models/Analyst'
import Group from '../models/ticket/Group'
import GroupService from '../services/ticket/GroupService'

@Resolver(of => Group)
class GroupResolver {
  @Query(() => [Group])
  @Authorized('user')
  Group() {
    return GroupService.getAll()
  }

  @FieldResolver()
  analysts(@Root() root: Group): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Group.findOne(root.id, { relations: ['analysts'] }).then(group => {
        resolve(group!.analysts)
      })
    })
  }
}

export default GroupResolver
