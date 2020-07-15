import { DeleteResult } from 'typeorm'
import Seed from './Seed'
import Generate from './Generate'
import KnowledgeStatus from '~/server/models/knowledge/KnowledgeStatus'

class KnowledgeStatusSeed implements Seed<KnowledgeStatus> {
  init(): Promise<KnowledgeStatus> {
    const status = new KnowledgeStatus()
    status.name = 'test'
    status.description = 'test description'
    return status.save()
  }

  generateMany(number: number): Promise<KnowledgeStatus[]> {
    return Generate.many<KnowledgeStatusSeed>(new KnowledgeStatusSeed(), number)
  }

  destroy(): Promise<DeleteResult> {
    return KnowledgeStatus.delete({})
  }
}

export default KnowledgeStatusSeed
