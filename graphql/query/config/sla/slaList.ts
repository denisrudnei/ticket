import ggl from 'graphql-tag';

const query = ggl`
query {
  slas: Sla {
    name
    limit
  }
}
`;

export default query;
