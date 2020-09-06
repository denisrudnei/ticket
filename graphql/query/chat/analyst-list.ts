import ggl from 'graphql-tag';

const query = ggl`
query {
  analyst: Analyst {
    id
    name
    picture
    status
  }
  chat: Chat {
    id
    participants {
      id
      name
      picture
    }
  }
  colors: StatusColor
}
`;

export default query;
