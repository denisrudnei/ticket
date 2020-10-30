import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const query = ggl`
query CategoryByName($name: String!) {
  category: CategoryByName(name: $name) {
    ...categoryList
  }
  groups: Group {
    id
    name
  }
}
${categoryList}
`;

export default query;
