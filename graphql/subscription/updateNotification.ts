import ggl from 'graphql-tag';
import notificationList from '@/graphql/fragments/notificationList';

const subscription = ggl`
subscription {
  UpdateNotification {
    ...notificationList
  }
}
${notificationList}
`;

export default subscription;
