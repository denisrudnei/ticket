/* eslint-disable class-methods-use-this */
import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Query,
  Resolver,
  Root,
  Mutation,
} from 'type-graphql';

import Knowledge from '../models/knowledge/Knowledge';
import Category from '../models/ticket/Category';
import Group from '../models/ticket/Group';
import KnowledgeService from '../services/knowledge/KnowledgeService';
import KnowledgeInput from '../inputs/KnowledgeInput';
import KnowledgeStatus from '../models/knowledge/KnowledgeStatus';

@Resolver((of) => Knowledge)
class KnowledgeResolver {
  @Query(() => [Knowledge])
  @Authorized('user')
  Knowledge() {
    return KnowledgeService.getAll();
  }

  @Query(() => [Knowledge])
  @Authorized('user')
  KnowledgeByGroup(@Arg('groupName') groupName: string) {
    return KnowledgeService.getByKnowledgeGroup(groupName);
  }

  @Query(() => Knowledge)
  @Authorized('user')
  KnowledgeById(@Arg('id', () => ID) id: Knowledge['id']) {
    return KnowledgeService.getOne(id);
  }

  @Mutation(() => Knowledge)
  @Authorized('user')
  CreateKnowledge(
    @Arg('knowledge', () => KnowledgeInput) knowledge: Knowledge,
  ) {
    return KnowledgeService.create(knowledge);
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  RemoveKnowledge(@Arg('id', () => ID) id: Knowledge['id']) {
    return KnowledgeService.remove(id);
  }

  @FieldResolver()
  async status(@Root() root: Knowledge): Promise<KnowledgeStatus> {
    const { status } = (await Knowledge.findOne(root.id, { relations: ['status'] }) as Knowledge);
    return status;
  }

  @FieldResolver()
  async group(@Root() root: Knowledge): Promise<Group> {
    const { group } = (await Knowledge.findOne(root.id, { relations: ['group'] }) as Knowledge);
    return group;
  }

  @FieldResolver()
  async category(@Root() root: Knowledge): Promise<Category> {
    const { category } = (await Knowledge.findOne(root.id, { relations: ['category'] }) as Knowledge);
    return category;
  }
}

export default KnowledgeResolver;
