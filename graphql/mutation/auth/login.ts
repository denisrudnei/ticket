import ggl from 'graphql-tag';

const mutation = ggl`
mutation Login($email: String!, $password: String!) {
  user: Login(email: $email, password: $password) {
    id
    name
    email
    color
  }
}
`;

export default mutation;
