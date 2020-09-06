import ggl from 'graphql-tag';
import list from '@/graphql/fragments/knowledge';

const query = ggl`
query {
  knowledge: Knowledge {
    ...list
  }
}
${list}
`;

export default query;
