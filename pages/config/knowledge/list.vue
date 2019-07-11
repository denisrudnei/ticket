<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-data-table :items="items" :headers="headers">
        <template v-slot:items="{item}">
          <td>{{ item.name }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'name'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/knowledge/').then(response => {
      return {
        items: response.data
      }
    })
  }
}
</script>

<style>
</style>
