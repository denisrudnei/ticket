import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateTicket($ticket: TicketCreateInput!) {
  CreateTicket(ticket: $ticket) {
    id
  }
}
`;

export default mutation;
