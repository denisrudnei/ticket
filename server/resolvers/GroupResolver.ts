import {
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
  ID,
  Arg,
  Mutation
} from 'type-graphql'

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

  @Query(() => Group)
  @Authorized('user')
  GetOneGroup(@Arg('id', () => ID) id: Group['id']): Promise<Group> {
    return GroupService.getOne(id)
  }

  @Mutation(() => Group)
  @Authorized('user')
  InsertAnalyst(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('analystId', () => ID) analystId: Analyst['id']
  ): Promise<Group> {
    return GroupService.insertAnalyst(groupId, analystId)
  }

  @Mutation(() => Group)
  @Authorized('user')
  RemoveAnalyst(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('analystId', () => ID) analystId: Analyst['id']
  ): Promise<Group> {
    return GroupService.removeAnalyst(groupId, analystId)
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
