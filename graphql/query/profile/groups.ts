import ggl from 'graphql-tag';

const query = ggl`
query AnalystById($id: ID!) {
  AnalystById(id: $id) {
    name
    groups {
      id
      name
    }
  }
}
`;

export default query;
