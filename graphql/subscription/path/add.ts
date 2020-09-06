import ggl from 'graphql-tag';

const subscription = ggl`
subscription($userId: ID!) {
  pathItem: NewPath(userId: $userId) {
    name
    id
    url
    children {
      name
      id
      url
      children {
        name
      }
    }
  }
}
`;

export default subscription;
