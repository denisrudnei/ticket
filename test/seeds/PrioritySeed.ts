import { DeleteResult } from 'typeorm'
import Generate from './Generate'
import Seed from './Seed'
import Priority from '~/server/models/ticket/Priority'

class PrioritySeed implements Seed<Priority> {
  init(): Promise<Priority> {
    return Priority.create({
      name: 'test',
      weight: 0
    }).save()
  }

  generateMany(number: number): Promise<Priority[]> {
    return Generate.many<PrioritySeed>(new PrioritySeed(), number)
  }

  destroy(): Promise<DeleteResult> {
    return Priority.delete({})
  }
}

export default PrioritySeed
