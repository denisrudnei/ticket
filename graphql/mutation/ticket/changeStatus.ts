import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const mutation = ggl`
mutation ChangeStatus($ticketId: ID!, $statusId: ID!) {
  ChangeStatus(ticketId: $ticketId, statusId: $statusId) {
    ...ticketList
  }
}
${ticketList}
`;

export default mutation;
