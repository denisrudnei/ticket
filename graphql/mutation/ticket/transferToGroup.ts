import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation transferToGroup($ticketId: ID!, $groupId: ID!) {
  TransferTicket(ticketId: $ticketId, groupId: $groupId)  {
    ...ticketList
  }
}
${ticketList}
`;

export default mutation;
