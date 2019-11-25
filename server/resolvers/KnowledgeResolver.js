const KnowledgeService = require('../services/knowledge/KnowledgeService')

const KnowledgeResolver = {
  Query: {
    Knowledge: () => {
      return KnowledgeService.getAll()
    },
    KnowledgeByGroup: (_, { groupName }) => {
      return KnowledgeService.getByKnowledgeGroup(groupName)
    },
    KnowledgeById: (_, { _id }) => {
      return KnowledgeService.getOne(_id)
    }
  },
  Mutation: {},
  Subscription: {}
}

module.exports = KnowledgeResolver
