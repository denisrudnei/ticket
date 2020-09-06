import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const query = ggl`
mutation EditCategory($categoryId: ID!, category: CategoryInput!) {
  category: EditCategory(categoryId: $categoryId, category: $category) {
    ...categoryList
  }
}
${categoryList}
`;

export default query;
