<template>
  <v-layout row wrap>
    <v-flex>
      <v-data-table :headers="headers" :items="values">
        <template v-slot:items="{ item }">
          <td>{{ item.name }}</td>
          <td>
            <v-btn icon>
              <v-icon>edit</v-icon>
            </v-btn>
          </td>
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
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/knowledge/category').then(response => {
      return {
        values: response.data
      }
    })
  }
}
</script>

<style>
</style>
