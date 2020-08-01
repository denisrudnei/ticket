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
  KnowledgeStatus(): Promise<KnowledgeStatus[]> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find().then((knowledges) => {
        resolve(knowledges);
      });
    });
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
