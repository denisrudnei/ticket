import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreatePriority($priority: PriorityInput!) {
  CreatePriority(priority: $priority) {
    id
  }
}
`;

export default mutation;
