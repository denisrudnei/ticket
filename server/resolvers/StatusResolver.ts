/* eslint-disable class-methods-use-this */
import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Query,
  Resolver,
  ResolverInterface,
  Root,
  Mutation,
} from 'type-graphql';
import Status from '../models/ticket/Status';
import StatusService from '../services/ticket/StatusService';
import StatusCreateInput from '../inputs/StatusCreateInput';
import StatusEditInput from '../inputs/StatusEditInput';

@Resolver((of) => Status)
class StatusResolver implements ResolverInterface<Status> {
  @Query(() => [Status])
  @Authorized('user')
  Status() {
    return StatusService.getStatus();
  }

  @Query(() => Status)
  @Authorized('user')
  FindStatus(@Arg('id', () => ID) id: Status['id']) {
    return StatusService.getOne(id);
  }

  @FieldResolver()
  async allowedStatus(@Root() status: Status): Promise<Status[]> {
    const { allowedStatus } = (await Status.findOne(status.id, { relations: ['allowedStatus'] }) as Status);
    return allowedStatus;
  }

  @Authorized('admin')
  @Mutation(() => Status)
  async CreateStatus(
    @Arg('status', () => StatusCreateInput) status: StatusCreateInput,
  ): Promise<Status> {
    const statusToSave = new Status();
    Object.assign(statusToSave, status);

    const allowedStatus = await Status.findByIds(status.allowedStatus);
    statusToSave.allowedStatus = allowedStatus;
    const newStatus = await StatusService.create(statusToSave);
    return newStatus;
  }

  @Authorized('admin')
  @Mutation(() => Status)
  async UpdateStatus(
    @Arg('id', () => ID) id: Status['id'],
    @Arg('status', () => StatusEditInput) status: StatusEditInput,
  ): Promise<Status> {
    const statusToEdit = new Status();
    Object.assign(statusToEdit, status);
    const allowedStatus = await Status.findByIds(status.allowedStatus);
    statusToEdit.allowedStatus = allowedStatus;
    const newStatus = await StatusService.edit(id, statusToEdit);
    return newStatus;
  }
}

export default StatusResolver;
