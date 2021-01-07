import TicketPagination from '@/server/models/TicketPagination';
import TicketAttributes from '~/server/inputs/TicketAttributes';

import Ticket from '../../models/ticket/Ticket';
import { sortTicket } from '../../types/SortOrder';

class SearchService {
  static async getTickets(
    query: Partial<TicketAttributes> = {},
    sort: sortTicket,
    page = 1,
    limit = 10,
  ): Promise<TicketPagination> {
    const total = await Ticket.count({ where: query });
    const pages = Math.ceil(total / limit);
    const result = await Ticket.find({
      where: query,
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
    });
    return new TicketPagination(result, total, page, pages, limit);
  }

  static async getTicketsByIds(
    query: Ticket['id'][],
    sort: sortTicket,
    page = 1,
    limit = 10,
  ): Promise<TicketPagination> {
    const result = await Ticket.findByIds(query, {
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
    });
    const total = result.length;
    const pages = Math.ceil(total / limit);

    // TODO
    return new TicketPagination(result, total, page, pages, limit);
  }
}

export default SearchService;
