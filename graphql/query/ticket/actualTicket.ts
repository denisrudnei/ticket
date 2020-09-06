import ggl from 'graphql-tag';
import ticketList from '@/graphql/fragments/ticketList';

const query = ggl`
query GetTicket($id: ID!) {
  TicketById(id: $id) {
    ...ticketList
    content
    category {
      fields {
        required
        text
        min
        max
      }
    }
    logs {
      user {
        id
        name
        picture
      }
      date
      group {
        id
        name
      }
      oldStatus {
        id
        name
      }
    }
    files {
      name
      type
      url
    }
    comments {
      user {
        id
        name
      }
      content
      date
    }
    priority {
      id
      name
      weight
    }
    children {
      ...ticketList
    }
    slaCount
    slaPercentage
  }
}
${ticketList}
`;

export default query;
