import ggl from 'graphql-tag';

const mutation = ggl`
mutation($userId: ID!, $path: ID!) {
  path: RemovePath(userId: $userId, path: $path) {
    id
  }
}`;
export default mutation;
