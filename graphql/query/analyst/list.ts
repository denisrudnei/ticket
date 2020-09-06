import ggl from 'graphql-tag';

const query = ggl`
query {
  Analyst {
    id
    name
    contactEmail
  }
}
`;

export default query;
