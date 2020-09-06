import ggl from 'graphql-tag';

const mutation = ggl`
mutation UpdatePriority($priority: PriorityInput!) {
  UpdatePriority(priority: $priority) {
    id
  }
}
`;

export default mutation;
