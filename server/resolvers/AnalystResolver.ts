const AnalystService = require('../services/AnalystService')

const AnalystResolver = {
  Query: {
    Analyst: () => {
      return AnalystService.getAnalysts()
    }
  }
}

export default AnalystResolver
