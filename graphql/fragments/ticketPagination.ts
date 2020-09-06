import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const fragment = ggl`
fragment ticketPagination on TicketPagination {
  total,
  page
  pages
  limit
  docs {
    ...ticketList
  }
}
${ticketList}
`;

export default fragment;
