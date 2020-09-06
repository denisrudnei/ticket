import ggl from 'graphql-tag';

const query = ggl`
query ReportByDate($field: String!, $start: DateTime, $end: DateTime) {
  ReportByDate(field: $field, start: $start, end: $end) {
    id
    total
  }
}
`;

export default query;
