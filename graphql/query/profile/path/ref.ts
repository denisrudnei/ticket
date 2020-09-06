import ggl from 'graphql-tag';

const query = ggl`
query {
  ref: Ref {
    objectName
    options
  }
}
`;

export default query;
