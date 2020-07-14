<template>
  <v-row>
    <v-col cols="12">
      <v-tabs color="primary white--text" show-arrows>
        <v-tab v-for="group in groups" :key="group.id" :to="`/knowledge/group/${group.name}`">
          {{ `(${group.length}) ${group.name}` }}
        </v-tab>
      </v-tabs>
    </v-col>
    <nuxt-child />
  </v-row>
</template>

<script>
import _ from 'lodash'
import knowledgeList from '@/graphql/query/knowledge/list.graphql'
import ggl from 'graphql-tag'
export default {
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(knowledgeList)
      })
      .then(response => {
        const g = _(response.data.knowledge)
          .groupBy('group.name')
          .value()
        return {
          groups: Object.keys(g).map(obj => ({
            id: g[obj][0].id,
            name: obj,
            length: g[obj].length
          }))
        }
      })
  },
  mounted() {
    if (this.$route.path === '/knowledge' && this.groups.length > 0) {
      this.$router.push(`/knowledge/group/${this.groups[0].name}`)
    }
  }
}
</script>

<style>
</style>
