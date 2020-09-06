import ggl from 'graphql-tag';

const query = ggl`
query {
  category: Category {
    id
    name
    fullName
    description
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
    file {
      url
    }
  }
}

`;

export default query;
