import ggl from 'graphql-tag';

const query = ggl`
query {
  category: Category {
    id
    fullName
    defaultStatus {
      id
      name
    }
    defaultGroup {
      id
      name
    }
    defaultPriority {
      id
      name
      weight
    }
  }
  group: Group {
    id
    name
  }
  status: Status {
    id
    name
  }
  priority: Priority {
    id
    name
    weight
  }
  sla: Sla {
    id
    name
    limit
  }
}
`;

export default query;
