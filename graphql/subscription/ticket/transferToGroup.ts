import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const subscription = ggl`
subscription {
  TransferToGroup {
    ...ticketList
  }
}
${ticketList}
`;

export default subscription;
