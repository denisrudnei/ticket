<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-data-table
        :items="status"
        :headers="headers"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
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
    return $axios.get('/status').then(response => {
      return {
        status: response.data
      }
    })
  }
}
</script>

<style>
</style>
