import ggl from 'graphql-tag';

const fragment = ggl`
fragment list on Knowledge {
  id
  name
  created
  group {
    id
    name
  }
  category {
    id
    name
  }
  status {
    id
    name
  }
}`;

export default fragment;
