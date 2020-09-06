import ggl from 'graphql-tag';

const query = ggl`
query AnalystById($id: ID!) {
  AnalystById(id: $id) {
    id
    name
    contactEmail
    picture
    status
    groups {
      id
      name
    }
  }
}
`;

export default query;
