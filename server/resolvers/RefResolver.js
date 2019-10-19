const PathService = require('../services/PathService')

const RefResolver = {
  Query: {
    Ref: () => {
      return PathService.getRefs()
    }
  }
}

module.exports = RefResolver
