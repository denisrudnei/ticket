import AddressResolver from './AddressResolver'
import AnalystResolver from './AnalystResolver'
import AuthResolver from './AuthResolver'
import CategoryResolver from './CategoryResolver'
import ChatResolver from './ChatResolver'
import GroupResolver from './GroupResolver'
import KnowledgeResolver from './KnowledgeResolver'
import PathResolver from './PathResolver'
import PriorityResolver from './PriorityResolver'
import RefResolver from './RefResolver'
import RoleResolver from './RoleResolver'
import SearchResolver from './SearchResolver'
import StatusResolver from './StatusResolver'
import TicketResolver from './TicketResolver'
import ReportResolver from './ReportResolver'
import SlaResolver from './SlaResolver'

import NotificationResolver from './NotificationResolver'

const base: any = {}

const resolversToMerge: any[] = [
  AddressResolver,
  AnalystResolver,
  AuthResolver,
  CategoryResolver,
  ChatResolver,
  GroupResolver,
  KnowledgeResolver,
  PathResolver,
  PriorityResolver,
  RefResolver,
  RoleResolver,
  SearchResolver,
  StatusResolver,
  TicketResolver,
  ReportResolver,
  SlaResolver,
  AuthResolver,
  NotificationResolver
]

resolversToMerge.forEach((resolver: any) => {
  if (resolver) {
    Object.keys(resolver).forEach(key => {
      if (!base[key]) {
        base[key] = resolver[key]
      }
      Object.assign(base[key], resolver[key])
    })
  }
})

export default base
