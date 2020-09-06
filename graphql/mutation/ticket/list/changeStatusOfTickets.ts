import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation ChangeStatusOfTickets($tickets: [ID!]!, $statusId: ID!) {
  ChangeStatusOfTickets(tickets: $tickets, statusId: $statusId) {
    ...ticketList
  }
}
${ticketList}
`;

export default mutation;
