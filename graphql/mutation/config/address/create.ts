import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateAddress($address: AddressCreateInput!) {
  CreateAddress(address: $address) {
    id
  }
}
`;

export default mutation;
