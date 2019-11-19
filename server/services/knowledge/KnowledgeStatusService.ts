import mongoose from 'mongoose'
import KnowledgeStatus, { IKnowledgeStatus } from '../../models/knowledge/KnowledgeStatus'

class KnowledgeStatusService  {
  create(status: IKnowledgeStatus): Promise<IKnowledgeStatus> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.create(
        {
          _id: new mongoose.Types.ObjectId(),
          ...status
        },
        (err: Error, result: IKnowledgeStatus) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  }
  getAll(): Promise<[IKnowledgeStatus]> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find({}, (err: Error, result: [IKnowledgeStatus]) => {
        if (err) return reject(err)
        return resolve(result)
      })
    })
  }
}
export default new KnowledgeStatusService()
