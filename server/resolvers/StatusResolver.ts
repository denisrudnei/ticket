import StatusService from '../services/ticket/StatusService'

const StatusResolver = {
  Query: {
    Status: () => {
      return StatusService.getStatus()
    },
    FindStatus: (_: any, { _id }: any) => {
      return StatusService.getOne(_id)
    }
  },
  Status: {
    allowedStatus: ({ _id }: any, _: any, __: any) => {
      return StatusService.getAllowedStatus(_id)
    }
  }
}

export default StatusResolver
