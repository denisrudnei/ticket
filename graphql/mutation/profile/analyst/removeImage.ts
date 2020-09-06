import ggl from 'graphql-tag';

const mutation = ggl`
mutation RemoveImage {
  RemoveImage {
    id
  }
}
`;

export default mutation;
