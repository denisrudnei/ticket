/* eslint-disable class-methods-use-this */
import SlaService from '@/server/services/ticket/SlaService';
import {
  Arg, Authorized, Mutation, Query, Resolver,
} from 'type-graphql';
import SlaAttributes from '../inputs/SlaAttributes';
import Sla from '../models/ticket/Sla';

@Resolver()
class SlaResolver {
  @Query(() => [Sla])
  @Authorized('user')
  Sla() {
    return SlaService.getAll();
  }

  @Mutation(() => Sla)
  @Authorized('user')
  CreateSla(@Arg('sla', () => SlaAttributes) sla: Sla) {
    return SlaService.create(sla);
  }
}

export default SlaResolver;
