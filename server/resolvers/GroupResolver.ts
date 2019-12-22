import GroupService from '../services/ticket/GroupService'
import {IResolvers} from 'graphql-tools'

const GroupResolver: IResolvers = {
  Query: {
    Group: () => {
      GroupService.getAll().then(value => {
        console.log(value)
      }).catch(err => {
        console.log(err)
      })
      return GroupService.getAll()
    }
  }
}

export default GroupResolver
