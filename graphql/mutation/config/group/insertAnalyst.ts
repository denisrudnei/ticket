import ggl from 'graphql-tag';

const mutation = ggl`
mutation InsertAnalyst($groupId: ID!, $analystId: ID!) {
  InsertAnalyst(groupId: $groupId, analystId: $analystId) {
    id
  }
}
`;

export default mutation;
