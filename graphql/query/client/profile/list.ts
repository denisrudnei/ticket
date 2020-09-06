import ggl from 'graphql-tag';

const query = ggl`
query {
  address: Address {
    id
    street
    name
  }
  user: GetLogged {
    id
    name
    email
    picture
    address {
      id
      name
      street
    }
  }
}
`;

export default query;
