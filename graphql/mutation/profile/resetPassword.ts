import ggl from 'graphql-tag';

const mutation = ggl`
mutation ResetPassword($oldPassword: String!, $newPassword: String!) {
  ResetPassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
`;
export default mutation;
