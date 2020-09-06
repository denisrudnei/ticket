import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation CopyTicket ($ticketId: ID!) {
  ticket: CopyTicket(ticketId: $ticketId) {
    ...ticketList
    content
  }
}
${ticketList}
`;

export default mutation;
