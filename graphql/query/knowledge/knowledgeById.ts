import ggl from 'graphql-tag';
import list from '@/graphql/fragments/knowledge';

const query = ggl`
query KnowledgeById($id: ID!){
  knowledge: KnowledgeById(id: $id) {
    ...list
    group {
      id
      name
    }
    category {
      id
      fullName
      name
    }
    preview
    url
  }
}
${list}
`;

export default query;
