const AnalystService = require('../services/AnalystService')

const AnalystResolver = {
  Query: {
    Analyst: () => {
      return AnalystService.getAnalysts()
    }
  }
}

module.exports = AnalystResolver
