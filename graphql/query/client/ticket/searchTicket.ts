import ggl from 'graphql-tag';

const query = ggl`
query SearchTicket($attributes: TicketAttributes, $page: Int!, $limit: Int!) {
  ticket: SearchTicket(attributes: $attributes, page: $page, limit: $limit) {
    docs {
      id
      resume
      status {
        id
        name
      }
      group {
        id
        name
      }
      created
      modified
      slaPercentage
      overtakeSla
    }
    page
    pages
  }
}
`;

export default query;
