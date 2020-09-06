import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateKnowledge($knowledge: KnowledgeInput!) {
  CreateKnowledge(knowledge: $knowledge) {
    id
    name
    description
    category {
      id
      name
    }
    group {
      id
      name
    }
  }
}`;
export default mutation;
