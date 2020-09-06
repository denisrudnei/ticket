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
  Category {
    id
    name
  }
  Analyst {
    id
    name
    picture
    contactEmail
  }
}
`;

export default query;
