<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs color="primary white--text" dark show-arrows>
        <v-tab to="/knowledge/">
          Não categorizado
        </v-tab>
        <v-tab v-for="group in groups" :key="group._id" :to="`/knowledge/group/${group.name}`">
          {{ group.name }}
        </v-tab>
      </v-tabs>
    </v-flex>
    <nuxt-child />
  </v-layout>
</template>

<script>
export default {
  asyncData({ $axios }) {
    return $axios.get('/group').then(response => {
      return {
        groups: response.data
      }
    })
  }
}
</script>

<style>
</style>
