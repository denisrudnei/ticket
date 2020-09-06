import ggl from 'graphql-tag';
import participantInfo from '@/graphql/fragments/participantInfo';

const subscription = ggl`
subscription NewMessage($to: ID!) {
  message: NewMessage(to: $to) {
    id
    content
    date
    to {
      ...participantInfo
    }
    from {
      ...participantInfo
    }
  }
}
${participantInfo}
`;

export default subscription;
