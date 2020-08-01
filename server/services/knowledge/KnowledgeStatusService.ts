import KnowledgeStatus from '../../models/knowledge/KnowledgeStatus';

class KnowledgeStatusService {
  static create(status: KnowledgeStatus): Promise<KnowledgeStatus> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.create({
        ...status,
      })
        .save()
        .then((result: KnowledgeStatus) => resolve(result));
    });
  }

  static getAll(): Promise<KnowledgeStatus[]> {
    return new Promise((resolve, reject) => {
      KnowledgeStatus.find().then((result: KnowledgeStatus[]) => resolve(result));
    });
  }
}
export default KnowledgeStatusService;
