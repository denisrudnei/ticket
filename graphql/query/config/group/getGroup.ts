import ggl from 'graphql-tag';

const query = ggl`
query GetOneGroup ($id: ID!) {
  group: GetOneGroup (id: $id) {
    id
    name
    description
    analysts {
      id
      name
      picture
    }
  }
}
`;

export default query;
