import ggl from 'graphql-tag';

const mutation = ggl`
mutation RemoveKnowledge($id: ID!) {
  RemoveKnowledge(id: $id)
}
`;

export default mutation;
