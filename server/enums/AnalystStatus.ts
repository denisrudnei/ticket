import { registerEnumType } from 'type-graphql';

enum AnalystStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
}

registerEnumType(AnalystStatus, {
  name: 'AnalystStatus',
});

export default AnalystStatus;
