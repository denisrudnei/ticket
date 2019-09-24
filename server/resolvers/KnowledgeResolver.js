const KnowledgeService = require('../services/knowledge/KnowledgeService')

const KnowledgeResolver = {
  Query: {
    Knowledge: () => {
      return KnowledgeService.getAll()
    },
    KnowledgeById: (_, { _id }) => {
      return KnowledgeService.getOne(_id)
    }
  },
  Mutation: {},
  Subscription: {}
}

module.exports = KnowledgeResolver
