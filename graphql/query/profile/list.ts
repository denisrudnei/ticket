import ggl from 'graphql-tag';

const query = ggl`
query {
  user: GetLogged {
    id
    name
    email
    color
    picture
    address {
      id
      name
      street
      city
      state
      country
    }
  }
  address: Address {
    id
    name
    street
    city
    state
    country
  }
  ProfileInfo {
    opened
    total
    categories {
      name
      total
    }
    status {
      name
      total
    }
    inName {
      name
      total
    }
  }
}
`;

export default query;
