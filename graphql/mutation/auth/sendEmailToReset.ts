import ggl from 'graphql-tag';

const mutation = ggl`
mutation GenerateEmailToReset($email: String!) {
  GenerateEmailToReset(email: $email)
}`;

export default mutation;
