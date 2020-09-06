import ggl from 'graphql-tag';

const mutation = ggl`
mutation AddChildren($ticketId: ID!, $children: [ID!]!) {
  AddChildren(ticketId: $ticketId, children: $children) {
    id
    resume
  }
}`;

export default mutation;
