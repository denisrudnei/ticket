import ggl from 'graphql-tag';

const mutation = ggl`
mutation MergeUser($email: String!, $user: AnalystMergeInput!) {
  MergeUser(email: $email, user: $user) {
    id
    name
    email
    contactEmail
    address {
      id
      street
      city
      country
      state
    }
    color
    role {
      id
      name
    }
    picture
    address {
      id
    }
  }
}
`;

export default mutation;
