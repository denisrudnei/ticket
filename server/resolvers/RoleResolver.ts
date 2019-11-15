const RoleService = require('../services/RoleService')

const RoleResolver = {
  Query: {
    Role: () => {
      return RoleService.getRoles()
    }
  },
  Mutation: {},
  Subscription: {}
}

module.exports = RoleResolver
