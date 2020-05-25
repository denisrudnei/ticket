import { Query, Resolver, Arg, Int, Authorized } from 'type-graphql'
import SearchService from '../services/ticket/SearchService'
import Ticket from '../models/ticket/Ticket'
import TicketAttributes from '../inputs/TicketAttributes'
import TicketPagination from '../models/TicketPagination'

@Resolver()
class SearchResolver {
  @Query(() => TicketPagination)
  @Authorized('user')
  SearchTicket(
    @Arg('page', () => Int, { nullable: true, defaultValue: 0 }) page: number,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 0 }) limit: number,
    @Arg('attributes', () => TicketAttributes, { nullable: true })
    attributes: TicketAttributes,
    @Arg('descending', () => Int, { nullable: true, defaultValue: -1 })
    descending: number,
    @Arg('sortBy', {
      nullable: true,
      defaultValue: 'id'
    })
    sortBy: string
  ): Promise<TicketPagination> {
    return SearchService.getTickets(
      attributes,
      {
        [sortBy]: descending
      },
      page,
      limit
    )
  }
}

export default SearchResolver
