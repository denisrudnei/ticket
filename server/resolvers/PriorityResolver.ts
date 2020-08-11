/* eslint-disable class-methods-use-this */
import {
  Arg, Authorized, ID, Mutation, Query, Resolver,
} from 'type-graphql';

import PriorityInput from '../inputs/PriorityInput';
import Priority from '../models/ticket/Priority';
import PriorityService from '../services/PriorityService';

@Resolver()
class PriorityResolver {
  @Query(() => [Priority])
  @Authorized('user')
  Priority() {
    return PriorityService.getAll();
  }

  @Query(() => Priority)
  @Authorized('user')
  PriorityById(@Arg('id', () => ID) id: Priority['id']) {
    return PriorityService.getOne(id);
  }

  @Mutation(() => Priority)
  @Authorized('user')
  CreatePriority(@Arg('priority', () => PriorityInput) priority: Priority) {
    return PriorityService.create(priority);
  }

  @Mutation(() => Priority)
  @Authorized('user')
  UpdatePriority(@Arg('priority', () => PriorityInput) priority: Priority) {
    return PriorityService.edit(priority);
  }

  @Mutation(() => [Priority])
  @Authorized('user')
  UpdateManyPriorities(
    @Arg('priorities', () => [PriorityInput]) priorities: Priority[],
  ) {
    return PriorityService.editMany(priorities);
  }
}

export default PriorityResolver;
