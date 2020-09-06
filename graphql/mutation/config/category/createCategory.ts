import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const mutation = ggl`
mutation CreateCategory($category: CategoryCreateInput!) {
  CreateCategory(category: $category) {
    ...categoryList
  }
  ${categoryList}
}
`;

export default mutation;
