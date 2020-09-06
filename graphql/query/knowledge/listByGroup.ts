import ggl from 'graphql-tag';
import list from '@/graphql/fragments/knowledge';

const query = ggl`
query KnowledgeByGroup($groupName: String!) {
  knowledge: KnowledgeByGroup(groupName: $groupName) {
    ...list
  }
}
${list}
`;

export default query;
