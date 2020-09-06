import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation CreateTicket($ticket: TicketCreateInput!) {
  CreateTicket(ticket: $ticket) {
    ...ticketList
  }
}
${ticketList}
`;

export default mutation;
