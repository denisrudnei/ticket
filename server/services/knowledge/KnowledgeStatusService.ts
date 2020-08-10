import KnowledgeStatus from '../../models/knowledge/KnowledgeStatus';

class KnowledgeStatusService {
  static async create(status: KnowledgeStatus): Promise<KnowledgeStatus> {
    return KnowledgeStatus.create({
      ...status,
    }).save();
  }

  static async getAll(): Promise<KnowledgeStatus[]> {
    return KnowledgeStatus.find();
  }
}
export default KnowledgeStatusService;
