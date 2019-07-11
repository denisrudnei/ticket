<template>
  <v-layout row wrap>
    <v-navigation-drawer>
      <v-list>
        <v-list-tile v-for="category in categories" :key="category._id" router :to="`/knowledge/category/${category.name}`">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ category.name }}
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
    return $axios.get('/knowledge/category').then(response => {
      return {
        categories: response.data
      }
    })
  }
}
</script>

<style>
</style>
