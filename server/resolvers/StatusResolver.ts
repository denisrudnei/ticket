import {
  Resolver,
  Query,
  Arg,
  ID,
  FieldResolver,
  Root,
  ResolverInterface,
  Authorized
} from 'type-graphql'
import StatusService from '../services/ticket/StatusService'
import Status from '../models/ticket/Status'

@Resolver(of => Status)
class StatusResolver implements ResolverInterface<Status> {
  @Query(() => [Status])
  @Authorized('user')
  Status() {
    return StatusService.getStatus()
  }

  @Query(() => Status)
  @Authorized('user')
  FindStatus(@Arg('id', () => ID) id: Status['id']) {
    return StatusService.getOne(id)
  }

  @FieldResolver()
  allowedStatus(@Root() status: Status): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      Status.findOne(status.id, { relations: ['allowedStatus'] }).then(
        status => {
          resolve(status!.allowedStatus)
        }
      )
    })
  }
}

export default StatusResolver
