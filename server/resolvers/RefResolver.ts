import PathService from '../services/PathService'
import {IResolvers} from 'graphql-tools'

const RefResolver: IResolvers = {
  Query: {
    Ref: () => {
      return PathService.getRefs()
    }
  }
}

export default RefResolver
