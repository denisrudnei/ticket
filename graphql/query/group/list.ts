import ggl from 'graphql-tag';

const query = ggl`
query {
  Group {
    id
    name
    description
  }
}
`;

export default query;
