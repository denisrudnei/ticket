import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const subscription = ggl`
subscription EditTicket($tickets: [ID!]!) {
  ticket: EditTicket(tickets: $tickets) {
    ...ticketList
    content
  }
}
${ticketList}
`;

export default subscription;
