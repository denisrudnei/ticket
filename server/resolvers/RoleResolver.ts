import { IResolvers } from 'graphql-tools'
import RoleService from '../services/RoleService'

const RoleResolver: IResolvers = {
  Query: {
    Role: () => {
      return RoleService.getRoles()
    }
  }
}

export default RoleResolver
