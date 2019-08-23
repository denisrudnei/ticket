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
          v-slot:items="{ item }"
        >
          <td>{{ item.name }}</td>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

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
  computed: mapGetters({
    status: 'status/getStatus'
  })
}
</script>

<style>
</style>
