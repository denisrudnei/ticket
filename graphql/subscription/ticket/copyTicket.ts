import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const subscription = ggl`
subscription {
  ticket: CopyTicket {
    ...ticketList
    content
  }
}
${ticketList}
`;

export default subscription;
