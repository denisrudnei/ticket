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
import GroupCreateInput from '../inputs/GroupCreateInput'
import GroupEditInput from '../inputs/GroupEditInput'

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
  CreateGroup(@Arg('group', () => GroupCreateInput) group: Group) {
    return GroupService.create(group)
  }

  @Mutation(() => Group)
  EditGroup(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('group', () => GroupEditInput) group: Group
  ): Promise<Group> {
    return new Promise((resolve, reject) => {
      if (!group!.analysts) {
        resolve(GroupService.edit(groupId, group))
      } else {
        const analystsUnknown: unknown = group!.analysts
        const analysts = analystsUnknown as Analyst['id'][]
        Promise.all(
          analysts.map(analyst => {
            return Analyst.findOne(analyst)
          })
        )
          .then(result => {
            group!.analysts = result as Analyst[]
            resolve(GroupService.edit(groupId, group))
          })
          .catch(e => {
            reject(e)
          })
      }
    })
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
