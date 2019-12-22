import KnowledgeService from '../services/knowledge/KnowledgeService'
import {IResolvers} from 'graphql-tools'

const KnowledgeResolver: IResolvers = {
  Query: {
    Knowledge: () => {
      return KnowledgeService.getAll()
    },
    KnowledgeByGroup: (_: any, { groupName }: any) => {
      return KnowledgeService.getByKnowledgeGroup(groupName)
    },
    KnowledgeById: (_: any, { _id }: any) => {
      return KnowledgeService.getOne(_id)
    }
  }
}

export default KnowledgeResolver
