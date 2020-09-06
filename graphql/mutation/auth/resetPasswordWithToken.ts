import ggl from 'graphql-tag';

const mutation = ggl`
mutation ResetPasswordWithToken($token: String!, $newPassword: String!) {
  ResetPasswordWithToken(token: $token, newPassword: $newPassword) {
    id
  }
}`;

export default mutation;
