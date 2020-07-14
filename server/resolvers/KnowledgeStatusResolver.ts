import { Resolver, Query, Authorized, Mutation, Arg } from 'type-graphql'
import KnowledgeStatus from '../models/knowledge/KnowledgeStatus'
import KnowledgeStatusService from '../services/knowledge/KnowledgeStatusService'
import KnowledgeStatusCreateInput from '../inputs/KnowledgeStatusCreateInput'

@Resolver()
class KnowledgeStatusResolver {
  @Query(() => [KnowledgeStatus])
  @Authorized('user')
  KnowledgeStatus(): Promise<KnowledgeStatus[]> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find().then(knowledges => {
        resolve(knowledges)
      })
    })
  }

  @Mutation(() => KnowledgeStatus)
  CreateKnowledgeStatus(
    @Arg('knowledgeStatus', () => KnowledgeStatusCreateInput)
    knowledgeStatus: KnowledgeStatus
  ): Promise<KnowledgeStatus> {
    return new Promise((resolve, reject) => {
      KnowledgeStatusService.create(knowledgeStatus).then(knowledgeStatus => {
        resolve(knowledgeStatus)
      })
    })
  }
}

export default KnowledgeStatusResolver
