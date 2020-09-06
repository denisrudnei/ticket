import ggl from 'graphql-tag';

const query = ggl`
query GetSubs($categoryId: ID){
  category: GetSubs (categoryId: $categoryId) {
    id
    name
    subs {
      name
    }
  }
}
`;

export default query;
