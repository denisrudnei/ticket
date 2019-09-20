const GroupService = require('../services/ticket/GroupService')

const GroupResolver = {
  Query: {
    Group: () => {
      return GroupService.getAll()
    }
  }
}

module.exports = GroupResolver
