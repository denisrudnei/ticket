import SlaService from '@/server/services/ticket/SlaService'
import { Resolver, Query, Mutation, Arg, Authorized } from 'type-graphql'
import Sla from '../models/ticket/Sla'
import SlaAttributes from '../inputs/SlaAttributes'

@Resolver()
class SlaResolver {
  @Query(() => [Sla])
  @Authorized('user')
  Sla() {
    return SlaService.getAll()
  }

  @Mutation(() => Sla)
  @Authorized('user')
  CreateSla(@Arg('sla', () => SlaAttributes) sla: Sla) {
    return SlaService.create(sla)
  }
}

export default SlaResolver
