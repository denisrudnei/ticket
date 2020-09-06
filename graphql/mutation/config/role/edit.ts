import ggl from 'graphql-tag';

const mutation = ggl`
mutation EditRole($roleId: ID!, $role: RoleInput!) {
  EditRole(roleId: $roleId, role: $role) {
    id
    name
    description
  }
}
`;

export default mutation;
