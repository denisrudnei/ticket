import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Query,
  Resolver,
  ResolverInterface,
  Root,
  Mutation
} from 'type-graphql'
import Status from '../models/ticket/Status'
import StatusService from '../services/ticket/StatusService'
import StatusCreateInput from '../inputs/StatusCreateInput'
import StatusEditInput from '../inputs/StatusEditInput'

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

  @Authorized('admin')
  @Mutation(() => Status)
  CreateStatus(
    @Arg('status', () => StatusCreateInput) status: StatusCreateInput
  ): Promise<Status> {
    return new Promise((resolve, reject) => {
      const statusToSave = new Status()
      Object.assign(statusToSave, status)

      Status.findByIds(status.allowedStatus).then(allowedStatus => {
        statusToSave.allowedStatus = allowedStatus
        StatusService.create(statusToSave).then(newStatus => {
          resolve(newStatus)
        })
      })
    })
  }

  @Authorized('admin')
  @Mutation(() => Status)
  UpdateStatus(
    @Arg('id', () => ID) id: Status['id'],
    @Arg('status', () => StatusEditInput) status: StatusEditInput
  ): Promise<Status> {
    return new Promise((resolve, reject) => {
      const statusToEdit = new Status()
      Object.assign(statusToEdit, status)
      Status.findByIds(status.allowedStatus).then(allowedStatus => {
        statusToEdit.allowedStatus = allowedStatus
        StatusService.edit(id, statusToEdit).then(newStatus => {
          resolve(newStatus)
        })
        return StatusService.edit(id, statusToEdit)
      })
    })
  }
}

export default StatusResolver
