<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
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
    </v-flex>
  </v-layout>
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
