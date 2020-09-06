import ggl from 'graphql-tag';

const mutation = ggl`
mutation RemoveChildren($ticketId: ID!, $childrenId: ID!) {
  RemoveChildren(ticketId: $ticketId, childrenId: $childrenId) {
    id
    resume
  }
}
`;

export default mutation;
