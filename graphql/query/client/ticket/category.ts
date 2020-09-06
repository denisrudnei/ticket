import ggl from 'graphql-tag';

const query = ggl`
query CategoryByName($name: String!) {
  category: CategoryByName(name: $name) {
    id
    fullName
    name
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
    fields {
      text
      min
      max
    }
  }
  addresses: Address {
    id
    name
  }
  analyst: Analyst {
    id
    name
    address {
      id
      name
    }
  }
}
`;

export default query;
