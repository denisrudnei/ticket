import ggl from 'graphql-tag';

const query = ggl`
query {
  role: Role {
    id
    name
  }

  analyst: Analyst {
    id
    name
    role {
      id
      name
    }
  }
}
`;

export default query;
