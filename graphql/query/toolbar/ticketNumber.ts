import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const query = ggl`
query TicketNumber($ids: [ID!]!) {
  SearchByIds(ids: $ids) {
    docs {
      ...ticketList
      content
    }
  }
}
${ticketList}
`;

export default query;
