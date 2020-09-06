import ggl from 'graphql-tag';

const query = ggl`
query {
  tree: PathTree {
    name
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

export default query;
