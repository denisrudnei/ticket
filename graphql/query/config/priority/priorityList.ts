import ggl from 'graphql-tag';

const query = ggl`
query {
  priority: Priority {
    id
    name
    weight
  }
}
`;

export default query;
