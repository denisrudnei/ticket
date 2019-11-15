const PriorityService = require('../services/PriorityService')

const PriorityResolver = {
  Query: {
    Priority: () => {
      return PriorityService.getAll()
    }
  },
  Mutation: {
    CreatePriority: (_, { priority }) => {
      return PriorityService.create(priority)
    },
    UpdatePriority: (_, { priority }) => {
      return PriorityService.edit(priority)
    },
    UpdateManyPriorities: (_, { priorities }) => {
      return PriorityService.editMany(priorities)
    }
  }
}

module.exports = PriorityResolver
