import ggl from 'graphql-tag';

const mutation = ggl`
mutation CommentOnTicket($ticketId: ID!, $content: String!) {
  CommentOnTicket(ticketId: $ticketId, content: $content) {
    id
  }
}
`;

export default mutation;
