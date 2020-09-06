import ggl from 'graphql-tag';

const query = ggl`
query {
  path: Path {
    id
    name
    objectName
    property
  }
}
`;

export default query;
