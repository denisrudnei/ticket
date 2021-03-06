import ggl from 'graphql-tag';

const query = ggl`
query {
  Status {
    id
    name
    allowedStatus {
      id
      name
    }
  }
  Group {
    id
    name
  }
  Analyst {
    id
    name
    address {
      id
      name
    }
  }
  Category {
    id
    defaultGroup {
      id
      name
    }
    defaultStatus {
      id
      name
    }
    defaultPriority {
      id
      name
    }
    name
    subs {
      id
      name
    }
    fields {
      text
      min
      required
      max
    }
    fullName
  }
  priority: Priority {
    id
    name
    weight
  }

  Address {
    id
    name
  }
}
`;

export default query;
