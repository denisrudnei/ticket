import { registerEnumType } from 'type-graphql';

enum SoundType {
  NOTIFICATION = 'NOTIFICATION',
  CHAT = 'CHAT',
}

registerEnumType(SoundType, {
  name: 'SoundType',
});

export default SoundType;
