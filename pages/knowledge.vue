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
export default {
  asyncData({ $axios }) {
    return $axios.get('/knowledge/all').then(response => {
      const g = _(response.data)
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
