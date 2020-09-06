import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const subscription = ggl`
subscription SlaUpdate($tickets: [ID!]!) {
  ticket: SlaUpdate(tickets: $tickets) {
    ...ticketList
    slaCount
  }
}
${ticketList}
`;

export default subscription;
