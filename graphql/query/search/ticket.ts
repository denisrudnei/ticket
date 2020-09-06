import ggl from 'graphql-tag';
import TicketPagination from '@/graphql/fragments/ticketPagination';

const query = ggl`
query Tickets ($page: Int, $limit: Int, $descending: Int, $sortBy: String, $attributes: TicketAttributes) {
  Tickets: SearchTicket (page: $page, limit: $limit, descending: $descending, sortBy: $sortBy, attributes: $attributes) {
    ...ticketPagination
  }
}
${TicketPagination}
`;

export default query;
