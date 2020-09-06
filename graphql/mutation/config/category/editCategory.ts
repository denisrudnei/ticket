import ggl from 'graphql-tag';
import categoryList from '@/graphql/fragments/categoryList';

const mutation = ggl`
mutation EditCategory($categoryId: ID!, $category: CategoryInput!) {
  EditCategory(categoryId: $categoryId, category: $category) {
    ...categoryList
  }
}
${categoryList}
`;

export default mutation;
