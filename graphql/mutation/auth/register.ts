import ggl from 'graphql-tag';

const mutation = ggl`
mutation Login($email: String!, $name: String!, $password: String!) {
  user: Register(email: $email, name: $name, password: $password) {
    id
    name
    email
    color
  }
}
`;

export default mutation;
