import ggl from 'graphql-tag';

const mutation = ggl`
mutation ChangeStatus($status: AnalystStatus!) {
  ChangeChatStatus(status: $status) {
    id
  }
}
`;

export default mutation;
