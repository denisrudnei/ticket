import ggl from 'graphql-tag';
import participantInfo from '@/graphql/fragments/participantInfo';

const query = ggl`
query GetOneChat($to: ID!){
  chat: GetOneChat(to: $to) {
    id
    participants {
      ...participantInfo
    }
    messages {
      id
      to {
        id
        name
        picture
      }
      from {
        id
        name
        picture
      }
      date
      content
    }
  }
}
${participantInfo}
`;

export default query;
