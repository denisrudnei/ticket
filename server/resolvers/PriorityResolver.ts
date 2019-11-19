import PriorityService from '../services/PriorityService'

const PriorityResolver = {
  Query: {
    Priority: () => {
      return PriorityService.getAll()
    }
  },
  Mutation: {
    CreatePriority: (_: any, { priority }: any) => {
      return PriorityService.create(priority)
    },
    UpdatePriority: (_: any, { priority }: any) => {
      return PriorityService.edit(priority)
    },
    UpdateManyPriorities: (_: any, { priorities }: any) => {
      return PriorityService.editMany(priorities)
    }
  }
}

export default PriorityResolver
