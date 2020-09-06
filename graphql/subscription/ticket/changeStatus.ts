import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const subscription = ggl`
subscription {
  ChangeStatus {
    ...ticketList
  }
}
${ticketList}
`;

export default subscription;
