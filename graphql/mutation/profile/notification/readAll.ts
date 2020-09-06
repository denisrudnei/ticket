import ggl from 'graphql-tag';
import notificationList from '@/graphql/fragments/notificationList';

const mutation = ggl`
mutation {
  ReadAllNotifications {
    ...notificationList
  }
}
${notificationList}
`;

export default mutation;
