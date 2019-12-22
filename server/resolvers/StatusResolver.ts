import StatusService from '../services/ticket/StatusService'
import {IResolvers} from 'graphql-tools'

const StatusResolver: IResolvers = {
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
