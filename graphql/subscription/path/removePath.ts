import ggl from 'graphql-tag';

const subscription = ggl`
subscription($userId: ID!) {
  path: RemovePath(userId: $userId) {
    id
  }
}
`;

export default subscription;
