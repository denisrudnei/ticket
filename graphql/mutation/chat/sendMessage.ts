import ggl from 'graphql-tag';

const mutation = ggl`
mutation SendMessage($to: ID!, $message: String!){
  message: SendMessage(to: $to, message: $message) {
    date
    content
    to {
      name
      id
      picture
    }
    from {
      name
      id
      picture
    }
  }
}
`;

export default mutation;
