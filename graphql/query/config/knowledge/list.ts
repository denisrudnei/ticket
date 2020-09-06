import ggl from 'graphql-tag';

const query = ggl`
query {
  Knowledge {
    id
    name
    status {
      id
      name
    }
    group {
      id
      name
    }
    category {
      id
      name
    }
  }
}
`;

export default query;
