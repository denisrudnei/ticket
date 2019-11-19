import GroupService from '../services/ticket/GroupService'

const GroupResolver = {
  Query: {
    Group: () => {
      return GroupService.getAll()
    }
  }
}

export default GroupResolver
