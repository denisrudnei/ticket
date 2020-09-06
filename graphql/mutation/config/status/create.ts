import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateStatus($status: StatusCreateInput!) {
  CreateStatus (status: $status) {
    id
    name
    description
    allowedStatus {
      id
      name
    }
  }
}
`;

export default mutation;
