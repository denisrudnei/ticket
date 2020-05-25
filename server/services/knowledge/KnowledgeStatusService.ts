import KnowledgeStatus from '../../models/knowledge/KnowledgeStatus'

class KnowledgeStatusService {
  create(status: KnowledgeStatus): Promise<KnowledgeStatus> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.create({
        ...status
      })
        .save()
        .then((result: KnowledgeStatus) => {
          return resolve(result)
        })
    })
  }

  getAll(): Promise<KnowledgeStatus[]> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find().then((result: KnowledgeStatus[]) => {
        return resolve(result)
      })
    })
  }
}
export default new KnowledgeStatusService()
