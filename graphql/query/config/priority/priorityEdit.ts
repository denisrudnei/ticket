import ggl from 'graphql-tag';

const query = ggl`
query PriorityById($id: ID!){
  priority: PriorityById(id: $id) {
    id
    name
    weight
  }
}
`;

export default query;
