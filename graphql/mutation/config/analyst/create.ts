import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateAnalyst($analyst: AnalystInput!) {
  CreateAnalyst(analyst: $analyst) {
    id
  }
}
`;

export default mutation;
