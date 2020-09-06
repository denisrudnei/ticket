import ggl from 'graphql-tag';

const mutation = ggl`
mutation UpdateStatus($id: ID!, $status: StatusEditInput!) {
  UpdateStatus (id: $id, status: $status) {
    id
    name
    description
  }
}
`;

export default mutation;
