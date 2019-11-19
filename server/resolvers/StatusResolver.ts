import StatusService from '../services/ticket/StatusService'

const StatusResolver = {
  Query: {
    Status: () => {
      return StatusService.getStatus()
    },
    FindStatus: (_: any, { _id }: any) => {
      return StatusService.getOne(_id)
    }
  }
}

export default StatusResolver
