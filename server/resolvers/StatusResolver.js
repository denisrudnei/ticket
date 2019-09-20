const StatusService = require('../services/ticket/StatusService')

const StatusResolver = {
  Query: {
    Status: () => {
      return StatusService.getStatus()
    },
    FindStatus: (_, { id }) => {
      return StatusService.getOne(id)
    }
  }
}

module.exports = StatusResolver
