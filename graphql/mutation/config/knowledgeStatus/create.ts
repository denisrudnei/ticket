import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateKnowledgeStatus($knowledgeStatus: KnowledgeStatusCreateInput!) {
  CreateKnowledgeStatus(knowledgeStatus: $knowledgeStatus) {
    id
    name
    description
  }
}`;

export default mutation;
