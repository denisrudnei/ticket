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
        <template
          v-slot:item.edit="{ item }"
        >
          <v-btn icon class="primary white--text" :to="`/config/status/edit/${item._id}`">
            <v-icon>edit</v-icon>
          </v-btn>
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
        },
        {
          text: 'Editar',
          value: 'edit'
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
