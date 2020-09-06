import ggl from 'graphql-tag';

const query = ggl`
query {
  Group {
    id
    name
    analysts {
      id
      name
      picture
    }
  }
  Analyst {
    id
    name
  }
}
`;

export default query;
