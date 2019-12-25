import { IResolvers } from 'graphql-tools'
import PathService from '../services/PathService'

const RefResolver: IResolvers = {
  Query: {
    Ref: () => {
      return PathService.getRefs()
    }
  }
}

export default RefResolver
