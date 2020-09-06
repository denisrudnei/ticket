import ggl from 'graphql-tag';

const subscription = ggl`
subscription {
  ChangeAnalystStatus {
    id
    status
  }
}`;

export default subscription;
