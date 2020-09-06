import ggl from 'graphql-tag';

const query = ggl`
query {
  Address {
    id
    name
    street
    city
    state
    country
  }
}`;

export default query;
