import ggl from 'graphql-tag';

const query = ggl`
query KnowledgeById ($id: ID!) {
  knowledge: KnowledgeById(id: $id) {
    id
    name
    description
    category {
      id
      name
    }
    status {
      id
      name
    }
    group {
      id
      name
    }
  }
}
`;

export default query;
