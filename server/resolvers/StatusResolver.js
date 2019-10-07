const StatusService = require('../services/ticket/StatusService')

const StatusResolver = {
  Query: {
    Status: () => {
      return StatusService.getStatus()
    },
    FindStatus: (_, { _id }) => {
      return StatusService.getOne(_id)
    }
  }
}

module.exports = StatusResolver
