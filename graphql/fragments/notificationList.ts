import ggl from 'graphql-tag';

const fragment = ggl`
fragment notificationList on Notification {
  id
  to {
    id
    name
  }
  content
  read {
    id
    name
  }
  date
  from {
    id
    name
  }
}`;
export default fragment;
