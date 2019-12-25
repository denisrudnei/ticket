import { IResolvers } from 'graphql-tools'
import GroupService from '../services/ticket/GroupService'

const GroupResolver: IResolvers = {
  Query: {
    Group: () => {
      return GroupService.getAll()
    }
  }
}

export default GroupResolver
