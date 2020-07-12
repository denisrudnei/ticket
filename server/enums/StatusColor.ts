import { registerEnumType } from 'type-graphql'

enum StatusColor {
  ONLINE = 'green',
  OFFLINE = 'black',
  AWAY = 'yellow',
  BUSY = 'red'
}

registerEnumType(StatusColor, {
  name: 'StatusColor'
})

export default StatusColor
