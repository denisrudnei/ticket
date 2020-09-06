import ggl from 'graphql-tag';

const query = ggl`
query NotificationById($id: ID!) {
  NotificationById(id: $id) {
    id
    content
    read {
      id
      name
    }
    to {
      id
      name
    }
    from {
      id
      name
    }
    type
    date
  }
}
`;

export default query;
