import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const query = ggl`
query TicketById($id: ID!) {
  ticket: TicketById(id: $id) {
    ...ticketList
    content
    slaPercentage
  }
}
${ticketList}
`;

export default query;
