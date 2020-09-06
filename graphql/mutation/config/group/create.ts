import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateGroup($group: GroupCreateInput!) {
  CreateGroup(group: $group) {
    id
    name
  }
}
`;

export default mutation;
