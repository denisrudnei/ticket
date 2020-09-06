import ggl from 'graphql-tag';

const mutation = ggl`
mutation UpdateRole($roleId: ID!, $userId: ID!) {
  UpdateRole(roleId: $roleId, userId: $userId)
}
`;

export default mutation;
