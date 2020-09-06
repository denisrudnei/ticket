import ggl from 'graphql-tag';

const fragment = ggl`
fragment participantInfo on Analyst {
  id
  name
  picture
}`;

export default fragment;
