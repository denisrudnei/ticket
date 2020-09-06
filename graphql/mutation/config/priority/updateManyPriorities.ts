import ggl from 'graphql-tag';

const mutation = ggl`
mutation UpdateManyPriorities($priorities: [PriorityInput!]!) {
  UpdateManyPriorities(priorities: $priorities) 
}`;

export default mutation;
