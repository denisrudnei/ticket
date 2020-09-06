import ggl from 'graphql-tag';

const query = ggl`
query {
  KnowledgeStatus {
    id
    name
    description
  }
}
`;

export default query;
