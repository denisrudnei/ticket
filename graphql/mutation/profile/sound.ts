import ggl from 'graphql-tag';

const mutation = ggl`
mutation SetSoundConfig($config: [SoundInput!]!) {
  SetSoundConfig(config: $config) {
    id
    name
  }
}
`;

export default mutation;
