import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const query = ggl`
query {
  category: Category {
    ...categoryList
  }
}
${categoryList}
`;

export default query;
