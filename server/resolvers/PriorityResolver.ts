import { IResolvers } from 'graphql-tools'
import PriorityService from '../services/PriorityService'

const PriorityResolver: IResolvers = {
  Query: {
    Priority: () => {
      return PriorityService.getAll()
    },
    PriorityById: (_: any, { _id }: any) => {
      return PriorityService.getOne(_id)
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
