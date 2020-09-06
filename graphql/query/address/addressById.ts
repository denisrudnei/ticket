import ggl from 'graphql-tag';

const query = ggl`
query AddressById($id: ID!) {
  AddressById(id: $id) {
    id
    cep
    name
    street
    city
    state
    country
  }
}
`;

export default query;
