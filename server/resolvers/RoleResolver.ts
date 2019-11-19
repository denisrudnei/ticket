import RoleService from '../services/RoleService'

const RoleResolver = {
  Query: {
    Role: () => {
      return RoleService.getRoles()
    }
  },
  Mutation: {},
  Subscription: {}
}

export default RoleResolver
