import ggl from 'graphql-tag';

const query = ggl`
query TicketReport($attributes: ReportAttributes!, $field: String!) {
  TicketReport(attributes: $attributes, field: $field) {
    total
    name
  }
}
`;

export default query;
