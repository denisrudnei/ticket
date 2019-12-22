
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
import SeachResolver from './SearchResolver'
import StatusResolver from './StatusResolver'
import TicketResolver from './TicketResolver'
import {IResolvers} from 'graphql-tools'

const base: IResolvers = {
  Query: {},
  Mutation: {},
  Subscription: {}
}

const resolversToMerge = [AddressResolver, AnalystResolver, AuthResolver, CategoryResolver, ChatResolver, GroupResolver, KnowledgeResolver, PathResolver, PriorityResolver, RefResolver, RoleResolver, SeachResolver, StatusResolver, TicketResolver]
resolversToMerge.forEach((resolver) => {
  Object.assign(base.Query, resolver.Query)
  Object.assign(base.Mutation, resolver.Mutation)
  Object.assign(base.Subscription, resolver.Subscription)
})

export default base
