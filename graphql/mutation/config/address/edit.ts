import ggl from 'graphql-tag';

const mutation = ggl`
mutation EditAddress ($id: ID!, $address: AddressInput!) {
  EditAddress(id: $id, address: $address) {
    id
  }
}`;

export default mutation;
