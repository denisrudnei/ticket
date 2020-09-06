import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const query = ggl`
query {
  category: Category {
    ...categoryList
  }
  status: KnowledgeStatus {
    id
    name
  }
  group: Group {
    id
    name
    analysts {
      id
      name
      picture
    }
  }
  Analyst {
    id
    name
  }
}
${categoryList}
`;

export default query;
