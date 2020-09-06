import ggl from 'graphql-tag';
import notificationList from '@/graphql/fragments/notificationList';

const mutation = ggl`
mutation ReadNotification($id: ID!) {
  notification: ReadNotification(id: $id) {
    ...notificationList
  }
}
${notificationList}
`;

export default mutation;
