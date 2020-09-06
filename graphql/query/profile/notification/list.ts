import ggl from 'graphql-tag';
import notificationList from '@/graphql/fragments/notificationList';

const query = ggl`
query {
  notification: Notification {
    ...notificationList
  }
}
${notificationList}
`;

export default query;
