import ggl from 'graphql-tag';

const mutation = ggl`
mutation RemoveAnalyst($groupId: ID!, $analystId: ID!) {
  RemoveAnalyst(groupId: $groupId, analystId: $analystId) {
    id
  }
}
`;

export default mutation;
