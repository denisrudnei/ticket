import ggl from 'graphql-tag';

const mutation = ggl`
mutation EditGroup($groupId: ID!, $group: GroupEditInput!) {
  editGroup: EditGroup(groupId: $groupId, group: $group) {
    id
    name
    description
    analysts {
      id
      name
    }
  }
}
`;

export default mutation;
