import ggl from 'graphql-tag';

const mutation = ggl`
mutation AddPath($path: PathInput!){
  path: AddPath(path: $path) {
    name
    url
    children {
      name
      url
      children {
        name
      }
    }
  }
}
`;

export default mutation;
