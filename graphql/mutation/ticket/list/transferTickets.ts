import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation TransferTickets($tickets: [ID!]!, $groupId: ID!) {
  TransferTickets(tickets: $tickets, groupId: $groupId) {
    ...ticketList
  }
}
${ticketList}
`;

export default mutation;
