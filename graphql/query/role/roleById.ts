import ggl from 'graphql-tag';

const query = ggl`
query RoleById($id: ID!) {
  RoleById(id: $id) {
    id
    name
    description
  }
}
`;

export default query;
