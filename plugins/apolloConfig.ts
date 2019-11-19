import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink, HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import 'cross-fetch/polyfill'
// import fetch from 'node-fetch'
import ws from 'ws'
import {Context} from '@nuxt/types'


export default ({ app, req }: Context, inject: any) => {
  console.log(req)
  console.log(process.client)
  const url = {
    protocol: process.client
      ? window.location.protocol.replace(':', '')
      : /* req.protocol */ 'http',
    host: process.client ? window.location.host : req.headers.host
  }
  const httpLink = createHttpLink({
    uri: `${url.protocol}://${url.host}/api/graphql`,
    fetch,
    credentials: 'include',
    ...(process.server ? { headers: req.headers } : undefined)
  })
  console.log(url)
  const wsOrWss = url.protocol.includes('https') ? 'wss://' : 'ws://'

  const wsLink = new WebSocketLink({
    uri: `${wsOrWss}${url.host}/api/subscriptions`,
    options: {
      reconnect: true
    },
    ...(process.server ? { webSocketImpl: ws } : undefined)
  })

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const cache = new InMemoryCache()

  const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: true,
    ssrMode: process.server
  })

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient
  })

  Vue.use(VueApollo)

  // Vue.prototype.$apolloProvider = apolloProvider
  // app.$apollo = apolloProvider.defaultClient
}
