import ggl from 'graphql-tag';

const query = ggl`
query {
  roles: Role {
    id
    name
    description
  }
}
`;

export default query;
