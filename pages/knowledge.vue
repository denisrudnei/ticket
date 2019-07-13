<template>
  <v-layout row wrap>
    <v-navigation-drawer>
      <v-list>
        <v-list-tile v-for="group in groups" :key="group._id" router :to="`/knowledge/group/${group.name}`">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ group.name }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-flex>
      <nuxt-child />
    </v-flex>
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
