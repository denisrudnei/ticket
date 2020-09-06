import ggl from 'graphql-tag';

const query = ggl`
query {
  Status {
    id,
    name
    allowedStatus {
      id
      name
    }
  }
}
`;

export default query;
