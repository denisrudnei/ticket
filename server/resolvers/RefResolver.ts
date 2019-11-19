import PathService from '../services/PathService'

const RefResolver = {
  Query: {
    Ref: () => {
      return PathService.getRefs()
    }
  }
}

export default RefResolver
