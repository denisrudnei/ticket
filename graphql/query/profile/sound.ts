import ggl from 'graphql-tag';

const query = ggl`
query {
  GetSounds {
    id
    type
    muted
    volume
  }
  soundTypes
}
`;

export default query;
