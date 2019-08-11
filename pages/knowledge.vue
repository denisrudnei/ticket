<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs color="primary white--text" dark show-arrows>
        <v-tab v-for="group in groups" :key="group._id" :to="`/knowledge/group/${group.name}`">
          {{ `(${group.length}) ${group.name}` }}
        </v-tab>
      </v-tabs>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>

<script>
import _ from 'lodash'
export default {
  asyncData({ $axios }) {
    return $axios.get('/knowledge/all').then(response => {
      const g = _(response.data)
        .groupBy('group.name')
        .value()
      return {
        groups: Object.keys(g).map(obj => ({
          _id: g[obj][0]._id,
          name: obj,
          length: g[obj].length
        }))
      }
    })
  },
  mounted() {
    if (this.groups.length > 0) {
      this.$router.push(`/knowledge/group/${this.groups[0].name}`)
    }
  }
}
</script>

<style>
</style>
