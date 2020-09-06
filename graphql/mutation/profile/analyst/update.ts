import ggl from 'graphql-tag';

const mutation = ggl`
mutation UpdateAnalyst($analyst: AnalystInput!) {
  UpdateAnalyst(analyst: $analyst) {
    id
    name
  }
}
`;

export default mutation;
