import RoleService from '../services/RoleService'
import {IResolvers} from 'graphql-tools'

const RoleResolver: IResolvers = {
  Query: {
    Role: () => {
      return RoleService.getRoles()
    }
  }
}

export default RoleResolver
