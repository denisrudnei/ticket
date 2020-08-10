/* eslint-disable class-methods-use-this */
import {
  Resolver, Query, Authorized, Mutation, Arg,
} from 'type-graphql';
import KnowledgeStatus from '../models/knowledge/KnowledgeStatus';
import KnowledgeStatusService from '../services/knowledge/KnowledgeStatusService';
import KnowledgeStatusCreateInput from '../inputs/KnowledgeStatusCreateInput';

@Resolver()
class KnowledgeStatusResolver {
  @Query(() => [KnowledgeStatus])
  @Authorized('user')
  async KnowledgeStatus(): Promise<KnowledgeStatus[]> {
    return KnowledgeStatus.find();
  }

  @Mutation(() => KnowledgeStatus)
  async CreateKnowledgeStatus(
    @Arg('knowledgeStatus', () => KnowledgeStatusCreateInput)
      knowledgeStatus: KnowledgeStatus,
  ): Promise<KnowledgeStatus> {
    return KnowledgeStatusService.create(knowledgeStatus);
  }
}

export default KnowledgeStatusResolver;
