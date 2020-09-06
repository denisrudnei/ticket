import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation EditTicket($id: ID!, $ticket: TicketInput!) {
  ticket: EditTicket(id: $id, ticket: $ticket) {
    id
    ...ticketList
    content
  }
}
${ticketList}
`;

export default mutation;
