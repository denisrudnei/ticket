import ggl from 'graphql-tag';

const query = ggl`
query FindStatus ($id: ID!) {
  FindStatus(id: $id) {
    id
    name
    description
    allowedStatus {
      id
      name
    }
  }
}
`;

export default query;
