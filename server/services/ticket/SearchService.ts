import TicketPagination from '@/server/models/TicketPagination';
import Ticket from '../../models/ticket/Ticket';
import TicketAttributes from '~/server/inputs/TicketAttributes';

class SearchService {
  static async getTickets(
    query: Partial<TicketAttributes> = {},
    sortBy: any,
    page = 1,
    limit = 10,
  ): Promise<TicketPagination> {
    const total = await Ticket.count();
    const pages = Math.ceil(total / limit);
    const result = await Ticket.find({
      where: query,
      take: limit,
      skip: (page === 0 ? 1 : page - 1) * limit,
    });

    // TODO
    return new TicketPagination(result, total, page, pages, limit);
  }

  static async getTicketsByIds(
    query: Ticket['id'][],
    sortBy: any,
    page = 1,
    limit = 10,
  ): Promise<TicketPagination> {
    const result = await Ticket.findByIds(query, {
      take: limit,
      skip: (page === 0 ? 1 : page - 1) * limit,
    });
    const total = result.length;
    const pages = Math.ceil(total / limit);

    // TODO
    return new TicketPagination(result, total, page, pages, limit);
  }
}

export default SearchService;
