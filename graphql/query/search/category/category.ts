import ggl from 'graphql-tag';

const query = ggl`
query {
  category: Category {
    id
    father {
      id
      name
    }
    name
    subs {
      id
      name
    }
  }
}
`;

export default query;
