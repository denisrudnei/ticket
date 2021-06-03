/* eslint-disable class-methods-use-this */
import {
  Arg, Authorized, Int, Query, Resolver, ID,
} from 'type-graphql';
import TicketAttributes from '../inputs/TicketAttributes';
import TicketPagination from '../models/TicketPagination';
import SearchService from '../services/ticket/SearchService';
import Ticket from '../models/ticket/Ticket';
import { transformToSort } from '../utils/sortUtils';

@Resolver()
class SearchResolver {
  @Query(() => TicketPagination)
  @Authorized('user')
  SearchTicket(
    @Arg('page', () => Int, { nullable: true, defaultValue: 1 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 }) limit: number,
    @Arg('attributes', () => TicketAttributes, { nullable: true, defaultValue: {} })
      attributes: TicketAttributes,
    @Arg('descending', () => Int, { nullable: true, defaultValue: -1 })
      descending: number,
    @Arg('sortBy', () => [String], {
      nullable: true,
      defaultValue: ['id'],
    })
      sortBy: [string],
  ): Promise<TicketPagination> {
    return SearchService.getTickets(
      attributes,
      transformToSort(sortBy, descending),
      page,
      limit,
    );
  }

  @Query(() => TicketPagination)
  @Authorized('user')
  SearchByIds(
    @Arg('page', () => Int, { nullable: true, defaultValue: 0 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 0 }) limit: number,
    @Arg('ids', () => [ID], { nullable: true }) attributes: Ticket['id'][],
    @Arg('descending', () => Int, { nullable: true, defaultValue: -1 })
      descending: number,
    @Arg('sortBy', () => [String], {
      nullable: true,
      defaultValue: ['id'],
    })
      sortBy: string[],
  ): Promise<TicketPagination> {
    return SearchService.getTicketsByIds(
      attributes,
      transformToSort(sortBy, descending),
      page,
      limit,
    );
  }
}

export default SearchResolver;
