/* eslint-disable class-methods-use-this */
import { Resolver, Query } from 'type-graphql';
import StatsService from '../services/StatsService';
import DatabaseItemsCount from '../models/DatabaseItemsCount';

@Resolver()
class StatsResolver {
  @Query(() => [DatabaseItemsCount])
  DatabaseItemsCount() {
    return StatsService.getDatabaseItemsCount();
  }
}

export default StatsResolver;
