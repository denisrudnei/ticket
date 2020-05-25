import TicketPagination from '@/server/models/TicketPagination'
import Ticket from '../../models/ticket/Ticket'
class SearchService {
  async getTickets(
    query: any = {},
    sortBy: any,
    page = 1,
    limit = 10
  ): Promise<TicketPagination> {
    const total = await Ticket.count()
    const pages = Math.ceil(total / limit)
    const result = await Ticket.find({
      take: limit,
      skip: (page === 0 ? 1 : page - 1) * limit
    })

    // TODO
    return new TicketPagination(result, total, page, pages, limit)
  }
}

export default new SearchService()
