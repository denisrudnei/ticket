import ggl from 'graphql-tag';

const query = ggl`
query {
  status: Status {
    id
    name
    allowedStatus {
      id
      name
    }
  }
  group: Group {
    id
    name
  }
  category: Category {
    id
    name
  }
  analyst: Analyst {
    id
    name
  }
  priority: Priority {
    id
    name
    weight
  }
}
`;

export default query;
