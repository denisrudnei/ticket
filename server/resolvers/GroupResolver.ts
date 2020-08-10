/* eslint-disable class-methods-use-this */
import {
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
  ID,
  Arg,
  Mutation,
} from 'type-graphql';

import Analyst from '../models/Analyst';
import Group from '../models/ticket/Group';
import GroupService from '../services/ticket/GroupService';
import GroupCreateInput from '../inputs/GroupCreateInput';
import GroupEditInput from '../inputs/GroupEditInput';

@Resolver((of) => Group)
class GroupResolver {
  @Query(() => [Group])
  @Authorized('user')
  Group() {
    return GroupService.getAll();
  }

  @Query(() => Group)
  @Authorized('user')
  GetOneGroup(@Arg('id', () => ID) id: Group['id']): Promise<Group> {
    return GroupService.getOne(id);
  }

  @Mutation(() => Group)
  @Authorized('user')
  CreateGroup(@Arg('group', () => GroupCreateInput) group: Group) {
    return GroupService.create(group);
  }

  @Mutation(() => Group)
  async EditGroup(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('group', () => GroupEditInput) group: Group,
  ): Promise<Group> {
    if (!group.analysts) {
      return GroupService.edit(groupId, group);
    }
    const analystsUnknown: unknown = group!.analysts;
    const analysts = analystsUnknown as Analyst['id'][];
    const result = await Promise.all(analysts
      .map((analyst) => (Analyst.findOne(analyst))));
    group!.analysts = result as Analyst[];
    return GroupService.edit(groupId, group);
  }

  @Mutation(() => Group)
  @Authorized('user')
  InsertAnalyst(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('analystId', () => ID) analystId: Analyst['id'],
  ): Promise<Group> {
    return GroupService.insertAnalyst(groupId, analystId);
  }

  @Mutation(() => Group)
  @Authorized('user')
  RemoveAnalyst(
    @Arg('groupId', () => ID) groupId: Group['id'],
    @Arg('analystId', () => ID) analystId: Analyst['id'],
  ): Promise<Group> {
    return GroupService.removeAnalyst(groupId, analystId);
  }

  @FieldResolver()
  async analysts(@Root() root: Group): Promise<Analyst[]> {
    const { analysts } = (await Group.findOne(root.id, { relations: ['analysts'] }) as Group);
    return analysts;
  }
}

export default GroupResolver;
