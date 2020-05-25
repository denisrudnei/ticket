import { DeleteResult } from 'typeorm'
import Generate from './Generate'
import Seed from './Seed'
import Status from '~/server/models/ticket/Status'

class StatusSeed implements Seed<Status> {
  init(): Promise<Status> {
    return Status.create({
      name: 'new Status',
      description: 'status'
    }).save()
  }

  generateMany(number: number): Promise<Status[]> {
    return Generate.many<StatusSeed>(new StatusSeed(), number)
  }

  destroy(): Promise<DeleteResult> {
    return Status.delete({})
  }
}

export default StatusSeed
